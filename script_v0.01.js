const version = `v 0.01 ALPHA`
const scriptname = `LightOnOffPresence Script`
const constri = `Schmakus`

let defaultTransition = 1;  // Standardwert für die TransitionTime in Sekunden
let DimIntervall = 10;      // Dimmer Intervall: 10 = Zehnerschritte
let Threshold = 1000;       // Lux-Schwelle für das Auslösen der BWM

const praefix = "javascript.0.Lichtersteuerung"; //Grundpfad für Script Datenpunkte.

const logging = true; // Logging Ein/Aus
const extLogging = true // Erweitertes Logging Ein/Aus

//******* Hier Gruppen, Lampen und Zeitpläne anlegen */
let arrGroups = [
    //Büro
    {
        description: 'Licht Büro',                              //Beschreibung der Gruppe. Notwendig zur Erzeugung der Datenpunkte
        pathOn: ['hm-rpc.1.00171A499D46DC.32.PRESS_SHORT'], 
        pathOff: ['hm-rpc.1.00171A499D4685.1.PRESS_SHORT'], 
        pathDimmup: ['hm-rpc.1.00171A499D46DC.32.PRESS_LONG'], 
        pathDimmdown: ['hm-rpc.1.00171A499D4685.1.PRESS_LONG'],
        pathBWM: ['zigbee.0.00158d0004514986.occupancy'],
        pathLux: 'zigbee.0.00158d0004514986.illuminance',
        timerMotion: 10,                                        // Sekunden: Zeit, nachder das Licht ausgeschaltet wird, sofern keine Bewegung mehr erkannt wird.
        timerSwitch: 3600,                                      // Sekunden >0: Licht wird automatisch ausgeschaltet, sofern keine Bewegung mehr erkannt wird (Rückfallebene) 
        lights: [1,2],                                          // Leuchten, welche zur Gruppe gehören
        lockBWM: true,                                          // Sperre für Bewegungsmelder, wenn das Licht manuell per Taster oder Datenpunkt eingeschaltet wurde
        defaultSwitch: true,                                    // true: Lampen werden mit Schalter auf Default Helligkeit gesetzt // false: Lampen werden nach Zeitplan gesetzt
        keystrokes: 2,                                          // 1 = Nur ein Tastendruck EIN wird gewertet. >1 = Es werden entsprechend der Zahlt gewertet
    },
];

let arrLights = {
    1: {
        name: 'Büro Spot 1',                                    // Bezeichnung der Leuchte
        pathControl: 'zigbee.0.00158d000400ce1f.brightness',    // Pfad zum Datenpunkt, mit dem die Lampe geschaltet wird. (Brightness oder State)
        pathColortemp: 'zigbee.0.00158d000400ce1f.colortemp',   // Pfad zum Datenpunkt, mit dem die Farbtemperatur vorgegeben wird. - sofern vorhanden
        pathTransistion: 'zigbee.0.00158d000400ce1f.transition_time',   // Pfad zum Datenpunkt, für die Transition Time.
        pathColor: '',                                          // Pfad zum Datenpunkt, für die Farbe. - sofern vorhanden
        defaultLevel: 70,                                       // Default Level-Wert beim Einschalten, sollte kein Zeitplan zutreffen
        colorTemp: 251,                                         // Sofern ein Wert gesetzt ist, Farbtemperatur - sofern vorhanden
        color: '',                                              // Sofern ein Wert gesetzt ist, wird die Lampe entsprechend farbig. - sofern vorhanden
        schedules: [1,2],                                       // Zeitplan-Zuordnung, wann die Leuchte mit welcher Helligkeit leuchtet
        buttonPress: [1],                                       // Bei welchem Tastendruck soll die Lampe reagieren? (Nur rellevant wenn keystrokes > 1)
        emergency: 100,                                         // Level > 0: Das Licht wird Auslösen des Emergency Datenpunkts auf das eingestellte Level geschaltet
    },
    2: {
        name: 'Büro Spot 2',
        pathControl: 'zigbee.0.00158d000448dc72.brightness',    // Pfad zum Datenpunkt, mitdem die Lampe geschaltet wird. (Brightness oder State)
        pathColortemp: 'zigbee.0.00158d000448dc72.colortemp',   // Pfad zum Datenpunkt, mitdem die Lampe geschaltet wird. (Brightness oder State) - sofern vorhanden
        pathTransistion: 'zigbee.0.00158d000448dc72.transition_time',   // Pfad zum Datenpunkt, für die Transition Time.
        pathColor: '',                                          // Pfad zum Datenpunkt, für die Farbe. - sofern vorhanden
        defaultLevel: 70,                                       // Default Level-Wert beim Einschalten, sollte kein Zeitplan zutreffen
        colorTemp: 251,                                         // Sofern ein Wert gesetzt ist, Farbtemperatur - sofern vorhanden
        color: '',                                              // Sofern ein Wert gesetzt ist, wird die Lampe entsprechend farbig. - sofern vorhanden
        schedules: [1,2],                                       // Zeitplan-Zuordnung, wann die Leuchte mit welcher Helligkeit leuchtet
        buttonPress: [2],                                       // Bei welchem Tastendruck soll die Lampe reagieren?
        emergency: 100,                                         // Level > 0: Das Licht wird Auslösen des Emergency Datenpunkts auf das eingestellte Level geschaltet    
    },
    3: {
        name: 'Wohnzimmer Spots',
        pathControl: 'zigbee.0.00158d000448dc72.brightness',    // Pfad zum Datenpunkt, mitdem die Lampe geschaltet wird. (Brightness oder State)
        pathColortemp: 'zigbee.0.00158d000448dc72.colortemp',   // Pfad zum Datenpunkt, mitdem die Lampe geschaltet wird. (Brightness oder State) - sofern vorhanden
        pathTransistion: 'zigbee.0.00158d000448dc72.transition_time',   // Pfad zum Datenpunkt, für die Transition Time.
        pathColor: '',                                          // Pfad zum Datenpunkt, für die Farbe. - sofern vorhanden
        defaultLevel: 70,                                       // Default Level-Wert beim Einschalten, sollte kein Zeitplan zutreffen
        colorTemp: 251,                                         // Sofern ein Wert gesetzt ist, Farbtemperatur - sofern vorhanden
        color: '',                                              // Sofern ein Wert gesetzt ist, wird die Lampe entsprechend farbig. - sofern vorhanden
        schedules: [3],                                         // Zeitplan-Zuordnung, wann die Leuchte mit welcher Helligkeit leuchtet
        buttonPress: [1],                                       // Bei welchem Tastendruck soll die Lampe reagieren?
        emergency: 100,                                         // Level > 0: Das Licht wird Auslösen des Emergency Datenpunkts auf das eingestellte Level geschaltet   
    },
};

let arrSchedules = {
    // Zeitplan 1
	1: {from: '06:00', to: '22:00', brightness: 70, state: true, name:"Tagsüber von 6-22 Uhr: Helligkeit 70"  },
	// Zeitplan 2
	2: {from: '22:00', to: '06:00', brightness: 5, state: true, name:"Nachts von 22-6 Uhr Helligkeit 5" },
	// Zeitplan 3
	3: {from: '05:00', to: '22:00', brightness: 70, state: true, name:"Tagsüber von 6-22 Uhr: Helligkeit 70" },
	// Zeitplan 4
	4: {from: '22:00', to: '06:00', brightness: 0, state: false, name:"Nachts von 0 - 6 Uhr AUS" },
};

//------------------------------------------//
//                                          //
//     AB HIER NICHTS MEHR ÄNDERN           //
//                                          //
//------------------------------------------//

//******* Input pruefen und ggf. anpassen */
for (const i in arrGroups) {
    if (arrGroups[i].lights.length <= 0) {
        console.warn(`${scriptName}: Folgendes Objekt ist fehlerhaft und wurde gelöscht: ${(arrGroups[i].name )}`);
        delete arrGroups[i];
    } else {
        arrGroups[i].timerMotion = (arrGroups[i].timerMotion * 1000);   //Sekunden in Millisekunden
        arrGroups[i].timerSwitch = (arrGroups[i].timerSwitch * 1000);   //Sekunden in Millisekunden
        arrGroups[i].keystrokeCounter = 1;                              //Tastendruck-Zähler Initial auf 1 setzen
    };
};

for (const i in arrLights) {
    if (getObject(arrLights[i].pathControl)) {
        let objType = getObject(arrLights[i].pathControl);
        arrLights[i].stateType = objType.common.type;
        arrLights[i].lastState = null;
    }
};

//******* Datenpunkte für Zentralsteuerung */
let DpCount = 0;    //Zähler
let Counter = 0;    //Zähler
const States = [];  //Array mit anzulegenden Dps

for (const i in arrGroups) {
    let x = arrGroups[i].description.split(' ').join('_');
    States[DpCount] = { id: praefix + '.' + x + '.LightOn', initial: true, forceCreation: false, common: { read: true, write: true, name: 'Licht ' + arrGroups[i].description + ' an', type: "boolean", role: "button", def: false } };
    DpCount++;
    States[DpCount] = { id: praefix + '.' + x + '.LightOff', initial: true, forceCreation: false, common: { read: true, write: true, name: 'Licht ' + arrGroups[i].description + ' aus', type: "boolean", role: "button", def: false } };
    DpCount++;
    States[DpCount] = { id: praefix + '.' + x + '.MotionOnOff', initial: false, forceCreation: false, common: { read: true, write: true, name: 'Licht ' + arrGroups[i].description + ' an/aus nach Zeitplan', type: "boolean", role: "switch", def: false } };
    DpCount++;
    States[DpCount] = { id: praefix + '.' + x + '.LightState', initial: false, forceCreation: false, common: { read: true, write: false, name: 'Licht ' + arrGroups[i].description + ' Status', type: "boolean", def: false } };
    DpCount++;
    States[DpCount] = { id: praefix + '.' + x + '.MotionState', initial: false, forceCreation: false, common: { read: true, write: false, name: 'BWM ' + arrGroups[i].description + ' Status', type: "boolean", def: false } };
    DpCount++;
    arrGroups[i].pathOn.push(praefix + '.' + x + '.LightOn');
    arrGroups[i].pathOn.push(praefix + '.LightOn');
    arrGroups[i].pathOff.push(praefix + '.' + x + '.LightOff');
    arrGroups[i].pathOff.push(praefix + '.LightOff');
    arrGroups[i].pathBWM.push(praefix + '.' + x + '.MotionOnOff');
    arrGroups[i].motionstateDP = praefix + '.' + x + '.MotionState';
    arrGroups[i].pathEmergency = praefix + '.EmergencyLight';

};
States[DpCount] = { id: praefix + '.AllLightOn', initial: true, forceCreation: false, common: { read: true, write: true, name: 'Alle Lichter an', type: "boolean", role: "button", def: false } };
DpCount++;
States[DpCount] = { id: praefix + '.AllLightOff', initial: true, forceCreation: false, common: { read: true, write: true, name: 'Alle Lichter aus', type: "boolean", role: "button", def: false } };
DpCount++;
States[DpCount] = { id: praefix + '.EmergencyLight', initial: false, forceCreation: false, common: { read: true, write: true, name: 'Notlicht für alle Gruppen', type: "boolean", def: false } };
DpCount++;

//******* Alle States anlegen, createTrigger aufrufen wenn fertig */
let numStates = States.length;

States.forEach(function (state) {
    createStateAsync(state.id, state.initial, state.forceCreation, state.common, function () {
        numStates--;
        if (numStates === 0) {
            if (logging) console.log(`CreateStates fertig!`);
            for (const i in arrGroups) { //Channels erstellen
                let x = arrGroups[i].description.split(' ').join('_');
                setObjectAsync(praefix + "." + x, { type: 'channel', common: { name: arrGroups[i].description }, native: {} });
            };
            createTrigger(arrGroups, arrLights, arrSchedules);
        };
    });
});

//******* Logeintrag mit Scriptnamen, Version und Developer */
console.log(`${scriptname} ${version} ${constri}`);

//******* Schleife über das Objekt "Groups" mit Erstellung aller nötigen Trigger
function createTrigger(arrGroups, lights, schedules) {
    arrGroups.forEach(function (objTemp) {
 
        //--------------------------------------//
        //      Trigger Licht Taster ein        //
        //--------------------------------------//
        if(objTemp.pathOn) {
            on({ id: objTemp.pathOn, change: "any" }, function async(obj) {
                if (logging) console.log(`Taster Licht ein für Gruppe ${objTemp.description} wurde betätigt. // Objekt: ${obj.id}`);
                
                //Timeouts zurücksetzen
                stopTimeout(objTemp);

                //BWM Sperren
                if (objTemp.lockBWM) {
                    objTemp.switch = true;
                    if(logging)console.log(`Bewegungsmelder für Gruppe ${objTemp.description} wurden gesperrt`);
                } 

                //Safety Timeout wird gestartet, sofern die Timeout-Zeit größer/gleich 1 ist
                if (objTemp.timerSwitch >= 1) {
                    objTemp.safetyTimeout = setTimeout(async () => {
                        if(logging) console.log(`Safety Timeout von ${objTemp.pathOff} Wert: ${objTemp.safetyTimeout}`);
                        setLight(objTemp, 'off', defaultTransition, lights, schedules );
                    }, objTemp.timerSwitch);
                };

                //Licht einschalten
                if(objTemp.defaultSwitch){
                    setLight(objTemp, 'on', defaultTransition, lights, schedules );
                }else{
                    setLight(objTemp, 'schedule', defaultTransition, lights, schedules );
                }
            });
        };

        //--------------------------------------//
        //      Trigger Licht Taster aus        //
        //--------------------------------------//
        if(objTemp.pathOff) {
            on({ id: objTemp.pathOff, change: "any" }, async function (obj) {  // Trigger Licht aus
                if(logging) console.log(`Taster Licht aus für Gruppe ${objTemp.description} wurde betätigt. Objekt: ${obj.id}`);
                
                //Timeouts zurücksetzen
                stopTimeout(objTemp);

                //Bewegungsmelder für 2 Sekunden sperren, wenn das Licht manuell ausgeschaltet wurde
                objTemp.switch = true;
                if(logging) console.log(`2 Sekunden Sperre für BWM`);
                
                objTemp.bwmBreakTimeout = setTimeout(async () => {
                    objTemp.switch = false;
                    if(logging) console.log(`Bewegungsmelder wurde entsperrt`);
                }, 2000);
             
                //Licht ausschalten
                setLight(objTemp, 'off', defaultTransition, lights, schedules );
            });
        };

        //--------------------------------------//
        //      Trigger Licht hochdimmen      //
        //--------------------------------------//
        if(objTemp.pathDimmup) {
            on({ id: objTemp.pathDimmup, change: "any" }, async function (obj) {  // Trigger Dimmen Hoch
                if(logging) console.log(`Taster Licht hochdimmen für Gruppe ${objTemp.description} wurde betätigt. Objekt: ${objTemp.pathDimmup}`);
                
                //Letzten Lever-Wert holen
                const lastVal = await getState(objTemp.pathLevel);
                let lastValue = 0;
                lastValue = lastVal.val; 
                
                // Level begrenzen auf min. 1 und max. 100
                let DimmValue = Math.min(Math.max(lastValue + DimIntervall, 1), 100);
                let transitionTime = 0.4;
                if(lastValue != DimmValue) {
                    setLight(objTemp, DimmValue, transitionTime, lights, schedules );
                };                
            });
        };

        //--------------------------------------//
        //      Trigger Licht runterdimmen      //
        //--------------------------------------//
        if(objTemp.pathDimmdown) {
            on({ id: objTemp.pathDimmdown, change: "any" }, async function (obj) {  // Trigger Dimmen Runter
                if(logging) console.log(`Taster Licht runterdimmen für Gruppe ${objTemp.description} wurde betätigt. Objekt: ${objTemp.pathDimmdown}`);
                
                //Letzten Lever-Wert holen
                const lastVal = await getState(objTemp.pathLevel);
                let lastValue = 0;
                lastValue = lastVal.val; 
                
                // Level begrenzen auf min. 1 und max. 100
                let DimmValue = Math.min(Math.max(lastValue + (DimIntervall * -1), 1), 100);
                let transitionTime = 0.4;
                if(lastValue != DimmValue) {
                    setLight(objTemp, DimmValue, transitionTime, lights, schedules );
                };   
            });
        };

        //--------------------------------------//
        //      Trigger Licht Bewegungsmelder   //
        //--------------------------------------//
        if(objTemp.pathBWM) {            
            on({ id: objTemp.pathBWM, change: "any", ack: false}, async function (obj) {  // BWM
                console.warn(obj);
                //Wert des Triggers
                let value = obj.state.val;

                //Objekt-ID vom Channel
                var channelId = obj.id.split(".").slice(0,-1).join(".");
                if(logging) console.log(`Ein Bewegungsmelder der Gruppe ${objTemp.description} hat ausgelöst. // BWM: ${getChName(obj.id)} // Object: ${obj.id} State: // ${value}`);

                //Timeouts zurücksetzen
                stopTimeout(objTemp);

                //Motiostate alle BWMs abgleichen
                objTemp.Motionstate = false; //Motionstate initial auf false setzen, wird bei auch nur einem aktiven Bwm mit true überschrieben
                for (const i in objTemp.pathBWM) { // Alle BWMs der Gruppe prüfen, false setzen wenn ALLE false, true wenn EINER true
                    if (getState(objTemp.pathBWM[i]).val) {
                        objTemp.Motionstate = true;
                        if(logging) console.log(`Motionstate: ${objTemp.Motionstate} von BWM: ${getObject(channelId).common.name}`);
                    };
                };

                //Prüfen, ob BWM Sperre existiert
                objTemp.switch = (objTemp.switch != null) ? objTemp.switch : false;
                if(logging) console.log(`BWM Sperre ist: ${objTemp.switch}`);
                
                //Wenn Sperre nicht aktiv, dann darf der BWM arbeiten
                if(!objTemp.switch){
                    // Was passiert bei TRUE oder FALSE des BWMs
                    if(objTemp.Motionstate){ // Wenn ein BMW auf True steht
                        if(logging) console.log(`Motionsensor hat ausgelöst. Licht wird geschaltet`);
                        setLight(objTemp, 'schedule', defaultTransition, lights, schedules );
                    }
                    else{ // Wenn kein BWM mehr auf true steht
                        objTemp.Timeout = setTimeout(async () => {
                            setLight(objTemp, 'off', defaultTransition, lights, schedules );
                        }, objTemp.timerMotion);
                        if(logging) console.log(`Motionsensor hat keine Bewegung mehr erkannt. Timer wird gestartet: ${objTemp.Timeout}`);
                    }
                } else {
                    if(logging) console.log(`BWM Sperre ${objTemp.switch}`);
                }
            }); 
        };

       //--------------------------------------//
        //      Trigger Notlicht ein/aus       //
        //-------------------------------------//

        if(objTemp.pathEmergency) {
            on({ id: objTemp.pathEmergency, change: "ne" }, function async(obj) {
                
                var value = obj.state.val;
                
                //Wenn Wert = True
                if (value) {
                    if (logging) console.log(`Notlicht wurde betätigt. // Objekt: ${obj.id}`)
                    
                    //Timeouts stoppen
                    stopTimeout(objTemp);
                    
                    //BWM Sperren
                    objTemp.switch = true;
                    console.log(`Bewegungsmelder für alle Gruppen wurden gesperrt`);

                    //Lichter einschalten
                    setLight(objTemp, 'emergencyOn', 0, lights, schedules );
                }
                //Wenn Value False
                else {
                    setLight(objTemp, 'emergencyOff', defaultTransition, lights, schedules );
                    //BWM Entperren
                    objTemp.switch = false;
                    console.log(`Bewegungsmelder für alle Gruppen wurden gesperrt`);
                    
                    //Safety Timeout wird gestartet, sofern die Timeout-Zeit größer/gleich 1 ist
                    if (objTemp.timerSwitch >= 1) {
                        objTemp.safetyTimeout = setTimeout(async () => {
                            if(logging) console.log(`Safety Timeout von ${objTemp.pathOff} Wert: ${objTemp.safetyTimeout}`);
                            setLight(objTemp, 'off', defaultTransition, lights, schedules );
                        }, objTemp.timerSwitch);
                    };
                };
            });
        };

    });
};

//******* Lampen steuern */
async function setLight(objTemp, control, transitionTime, lights, schedules) {
    //Prüfen, ob Befehl oder Dimmwert kommt
    if(isNaN(control)){
        switch (control) {
            case "on":
                // Schleife durch die einzelnen Lampen
                for (const i in objTemp.lights) {
                    let light = lights[objTemp.lights[i]];

                    setStates(light.pathTransistion, transitionTime, 'Transition Time');    //Wenn Pfad zu Transsition Time vorhanden und gültig ist
                    setStates(light.pathColortemp, light.colorTemp, 'Farbtemperatur');      //Wenn Pfad zu ColorTemp vorhanden und gültig ist
                    setStates(light.pathColor, light.color, 'Farbe');                       //Wenn Pfad zu Color vorhanden und gültig ist 

                    if (light.stateType = 'number') {
                        setStates(light.pathControl, light.defaultLevel, 'Licht Ein');      //Wenn Pfad zu Brightness vorhanden und gültig ist
                        if (extLogging) console.log(`Licht wird geschaltet: ${light.name}, (${light.pathControl}) // DefaultWert: ${objTemp.defaultLevel}`);
                    }else{
                        setStates(light.pathControl, true, 'Licht Ein');                    //Wenn Pfad zu State vorhanden und gültig ist
                        if (extLogging) console.log(`Licht wird geschaltet: ${light.name}, (${light.pathControl}) // Wert: true`);
                    };                    
                };
                break;
            
            case "off": 
                // Schleife durch die einzelnen Lampen
                for (const i in objTemp.lights) {
                    let light = lights[objTemp.lights[i]];
                    if (light.stateType = 'number') {
                        setStates(light.pathControl, 0, 'Licht Aus');       //Wenn Pfad zu Brightness vorhanden und gültig ist
                        if (extLogging) console.log(`Licht wird ausgeschaltet: ${light.name}, (${light.pathControl}) // Wert: 0`);
                    }else{
                        setStates(light.pathControl, false, 'Licht Aus');   //Wenn Pfad zu State vorhanden und gültig ist
                        if (extLogging) console.log(`Licht wird geschaltet: ${light.name}, (${light.pathControl}) // Wert: false`);
                    };  
                };
                break;
            
            case "schedule":
                // Schleife durch die einzelnen Lampen
                for (const i in objTemp.lights) {
                    let light = lights[objTemp.lights[i]];
                    let lightSchedules = lights[objTemp.lights[i]].schedules;
                    for (const y in lightSchedules) {
                        let sched = schedules[lightSchedules[y]];
                        //Sobald ein Zeitplan zutrifft, wird die Schleife beendet
                        if (compareTime(sched.from, sched.to, "between", null)) {
                            setStates(light.pathTransistion, transitionTime, 'Transition Time');    //Wenn Pfad zu Transsition Time vorhanden und gültig ist
                            setStates(light.pathColortemp, light.colorTemp, 'Farbtemperatur');      //Wenn Pfad zu ColorTemp vorhanden und gültig ist
                            setStates(light.pathColor, light.color, 'Farbe');                       //Wenn Pfad zu Color vorhanden und gültig ist
                            if (light.stateType = 'number') {
                                setStates(light.pathControl, sched.brightness, 'Licht Ein');        //Wenn Pfad zu Brightness vorhanden und gültig ist
                            }else{
                                setStates(light.pathControl, true, 'Licht Ein');                    //Wenn Pfad zu State vorhanden und gültig ist
                            }; 
                            if (extLogging) console.log(`Licht wird geschaltet: ${light.name}, (${light.pathControl}) // Zeitplan: ${sched.name}`);
                            break;
                        }
                        else{
                            console.log(`Kein Zeitplan hinterlegt für: ${light.name}, (${light.pathControl})`);
                        };
                    };
                };
                break;

            case "emergencyOn": 
                // Schleife durch alle Lampen
                for (const i in lights) {
                    //Wenn Emergency größer 0, dann wird Lampe geschaltet
                    if (lights[i].emergency >= 1) {
                        lights[i].oldState = await getState(lights[i].pathControl).val;
                        if (extLogging) console.log(`Notlicht Old State: ${lights[i].oldState}`);
                        if (lights[i].stateType = 'number') {
                            setStates(lights[i].pathControl, lights[i].emergency, 'Notlicht Ein');      //Wenn Pfad zu Brightness vorhanden und gültig ist
                        }else{
                            setStates(lights[i].pathControl, true, 'Notlicht Ein');                    //Wenn Pfad zu State vorhanden und gültig ist
                        };     
                    }                                   
                };
                //Datenpunkt bestätigen
                setStateAsync(praefix + '.EmergencyLight', true, true);
                break;
            
            case "emergencyOff": 
                // Schleife durch alle Lampen
                for (const i in lights) {
                    //Wenn Emergency größer 0, dann wird Lampe in den Ursprung vor dem Notlicht gesetzt
                    if (lights[i].emergency >= 1 && lights[i].oldState != null) {
                        setStates(lights[i].pathControl, lights[i].oldState, 'Notlicht Aus');      //Wenn Pfad zu Brightness vorhanden und gültig ist
                    }                                   
                };
                //Datenpunkt bestätigen
                setStateAsync(praefix + '.EmergencyLight', false, true);
                break;
            
            default: 
                console.warn(`Fehlerhafter Input bei setLight`);
                break;
        }
    }
    //Lampen werden gedimmt, sofern diese über die Helligkeit und nicht über true/false gesteuert werden
    else{
        for (const i in objTemp.lights) {
            let light = lights[objTemp.lights[i]];
            if (light.stateType = 'number') {
                setStates(light.pathControl, control, 'Dimmen');   //Wenn Pfad zu Brightness vorhanden und gültig ist
                if (extLogging) console.log(`Licht wird gedimmt: ${light.name}, (${light.pathControl}) // Wert: ${control}`);
            }
        };
    };
};

//----------------------//
//                      //
//      Funktionen      //
//                      //
//----------------------//

//******* Objekt-ID vom Channel */
function getChName(obj){
        var channelId = obj.split(".").slice(0,-1).join(".");
        return getObject(channelId).common.name;
};

//******* Set States */
function setStates(path, value, name){
     if (getObject(path)) {
        let oldval = getState(path).val;
        if(oldval != value){
            setState(path, value);
            if(extLogging) console.log(`${name}: Wert ${value} an Object ${path} gesetzt`);
        }else {
            if(extLogging) console.log(`${name}: Wert ${value} an Object ${path} nicht gesetzt. Wert schon vorhanden!`);
        }
    }else{
        if(logging) console.log(`${name}: Pfad ${path} nicht gesetzt oder ungültig. Wert kann nicht gesetzt werden`);
    }
};

//******* Stop Timeouts */
async function stopTimeout(objTemp) {
    //Safety Timeout zurücksetzen
    if (objTemp.safetyTimeout != null) {
        if(logging) console.log(`Reset des Safety Timeout von ${objTemp.pathOn} Wert: ${objTemp.safetyTimeout}`);
        clearTimeout(objTemp.safetyTimeout);
        objTemp.safetyTimeout = null;
    };
    //BWM Timeout zurücksetzen
    if (objTemp.Timeout != null) {
        if(logging) console.log(`Reset Timeout von ${obj.id} Wert: ${objTemp.Timeout}`);
        clearTimeout(objTemp.Timeout);
        objTemp.Timeout = null;
    };
}

