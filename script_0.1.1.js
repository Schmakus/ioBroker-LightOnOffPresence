const version = `v 0.1.1 BETA`
const scriptname = `ioBroker-LightOnOffPresence`
const constri = `Schmakus`

//------------------------------------------//
//    Allgemine Werte definieren            //
//------------------------------------------//
let defaultTransition = 0.8;                        // Standardwert für die TransitionTime in Sekunden
let DimIntervall = 10;                              // Dimmer Intervall: 10 = Zehnerschritte
let luxThreshold = 12;                            // Lux-Schwelle für das Auslösen der BWM

const statesPath = "javascript.0.Lichtersteuerung"; //Grundpfad für Script Datenpunkte.

const logging = false                               // Logging Ein/Aus
const extLogging = false                            // Erweitertes Logging Ein/Aus

//------------------------------------------//
//    Hier die Gruppen/Räume anlegen        //
//------------------------------------------//
let arrGroups = [
    //Büro
    {
        description: 'Büro',                                    //Beschreibung der Gruppe. Notwendig zur Erzeugung der Datenpunkte
        pathOn: ['hm-rpc.1.00171A499D46DC.32.PRESS_SHORT'],     //Pfad zum Taster für Licht ein
        pathOff: ['hm-rpc.1.00171A499D4685.1.PRESS_SHORT'],     //Pfad zum Taster für Licht aus
        pathDimmUp: ['hm-rpc.1.00171A499D46DC.32.PRESS_LONG'],  //Pfad zum Taster für Hochdimmen !!! Aktuell nur Homematic
        pathDimmDown: ['hm-rpc.1.00171A499D4685.1.PRESS_LONG'], //Pfad zum Taster für Runterdimmen !!! Aktuell nur Homematic
        pathBWM: ['zigbee.0.00158d0004514986.occupancy'],       //Pfad zum Bewegungsmelder
        pathLux: 'zigbee.0.00158d0004514986.illuminance',       //Pfad zum Lichtsensor in Lux
        timerMotion: 10,                                        // Sekunden: Zeit, nachder das Licht ausgeschaltet wird, sofern keine Bewegung mehr erkannt wird.
        timerSwitch: 3600,                                      // Sekunden >0: Licht wird automatisch ausgeschaltet, sofern keine Bewegung mehr erkannt wird (Rückfallebene) 
        lights: [1],                                            // Leuchten, welche zur Gruppe gehören
        lockBWM: true,                                          // Sperre für Bewegungsmelder, wenn das Licht manuell per Taster oder Datenpunkt eingeschaltet wurde
        defaultSwitch: true,                                    // true: Lampen werden mit Schalter auf Default Helligkeit gesetzt // false: Lampen werden nach Zeitplan gesetzt
        keyStrokes: 1,                                          // 1 = Nur ein Tastendruck EIN wird gewertet. >1 = Es werden entsprechend der Zahlt gewertet
    },
    //Ankleide
    {
        description: 'Ankleide',                                //Beschreibung der Gruppe. Notwendig zur Erzeugung der Datenpunkte
        pathOn: ['hm-rpc.1.00171A499D4685.11.PRESS_SHORT'],     //Pfad zum Taster für Licht ein
        pathOff: ['hm-rpc.1.00171A499D4685.12.PRESS_SHORT', 'hm-rpc.1.00171A499D4685.16.PRESS_SHORT'],    //Pfad zum Taster für Licht aus
        pathDimmUp: ['hm-rpc.1.00171A499D4685.11.PRESS_LONG'],  //Pfad zum Taster für Hochdimmen !!! Aktuell nur Homematic
        pathDimmDown: ['hm-rpc.1.00171A499D4685.12.PRESS_LONG'],//Pfad zum Taster für Runterdimmen !!! Aktuell nur Homematic
        pathBWM: [],                                            //Pfad zum Bewegungsmelder
        pathLux: '',                                            //Pfad zum Lichtsensor in Lux
        timerMotion: 10,                                        // Sekunden: Zeit, nachder das Licht ausgeschaltet wird, sofern keine Bewegung mehr erkannt wird.
        timerSwitch: 3600,                                      // Sekunden >0: Licht wird automatisch ausgeschaltet, sofern keine Bewegung mehr erkannt wird (Rückfallebene) 
        lights: [2],                                            // Leuchten, welche zur Gruppe gehören
        lockBWM: true,                                          // Sperre für Bewegungsmelder, wenn das Licht manuell per Taster oder Datenpunkt eingeschaltet wurde
        defaultSwitch: false,                                   // true: Lampen werden mit Schalter auf Default Helligkeit gesetzt // false: Lampen werden nach Zeitplan gesetzt
        keyStrokes: 1,                                          // 1 = Nur ein Tastendruck EIN wird gewertet. >1 = Es werden entsprechend der Zahlt gewertet
    },
    //Schlafzimmer
    {
        description: 'Schlafzimmer',                            //Beschreibung der Gruppe. Notwendig zur Erzeugung der Datenpunkte
        pathOn: ['hm-rpc.1.00171A499D4685.15.PRESS_SHORT'],     //Pfad zum Taster für Licht ein
        pathOff: ['hm-rpc.1.00171A499D4685.16.PRESS_SHORT'],    //Pfad zum Taster für Licht aus
        pathDimmUp: ['hm-rpc.1.00171A499D4685.15.PRESS_LONG'],  //Pfad zum Taster für Hochdimmen !!! Aktuell nur Homematic
        pathDimmDown: ['hm-rpc.1.00171A499D4685.16.PRESS_LONG'],//Pfad zum Taster für Runterdimmen !!! Aktuell nur Homematic
        pathBWM: [],                                            //Pfad zum Bewegungsmelder
        pathLux: '',                                            //Pfad zum Lichtsensor in Lux
        timerMotion: 10,                                        // Sekunden: Zeit, nachder das Licht ausgeschaltet wird, sofern keine Bewegung mehr erkannt wird.
        timerSwitch: 3600,                                      // Sekunden >0: Licht wird automatisch ausgeschaltet, sofern keine Bewegung mehr erkannt wird (Rückfallebene) 
        lights: [3],                                            // Leuchten, welche zur Gruppe gehören
        lockBWM: true,                                          // Sperre für Bewegungsmelder, wenn das Licht manuell per Taster oder Datenpunkt eingeschaltet wurde
        defaultSwitch: false,                                   // true: Lampen werden mit Schalter auf Default Helligkeit gesetzt // false: Lampen werden nach Zeitplan gesetzt
        keyStrokes: 1,                                          // 1 = Nur ein Tastendruck EIN wird gewertet. >1 = Es werden entsprechend der Zahlt gewertet
    },
    //Wohnzimmer Spots
    {
        description: 'Wohnzimmer Spots',                         //Beschreibung der Gruppe. Notwendig zur Erzeugung der Datenpunkte
        pathOn: ['hm-rpc.1.00171A499D46DC.14.PRESS_SHORT'],     //Pfad zum Taster für Licht ein
        pathOff: ['hm-rpc.1.00171A499D46DC.15.PRESS_SHORT'],    //Pfad zum Taster für Licht aus
        pathDimmUp: ['hm-rpc.1.00171A499D46DC.14.PRESS_LONG'],  //Pfad zum Taster für Hochdimmen !!! Aktuell nur Homematic
        pathDimmDown: ['hm-rpc.1.00171A499D46DC.15.PRESS_LONG'],//Pfad zum Taster für Runterdimmen !!! Aktuell nur Homematic
        pathBWM: [],                                            //Pfad zum Bewegungsmelder
        pathLux: '',                                            //Pfad zum Lichtsensor in Lux
        timerMotion: 10,                                        // Sekunden: Zeit, nachder das Licht ausgeschaltet wird, sofern keine Bewegung mehr erkannt wird.
        timerSwitch: 3600,                                      // Sekunden >0: Licht wird automatisch ausgeschaltet, sofern keine Bewegung mehr erkannt wird (Rückfallebene) 
        lights: [5],                                            // Leuchten, welche zur Gruppe gehören
        lockBWM: true,                                          // Sperre für Bewegungsmelder, wenn das Licht manuell per Taster oder Datenpunkt eingeschaltet wurde
        defaultSwitch: false,                                   // true: Lampen werden mit Schalter auf Default Helligkeit gesetzt // false: Lampen werden nach Zeitplan gesetzt
        keyStrokes: 1,                                          // 1 = Nur ein Tastendruck EIN wird gewertet. >1 = Es werden entsprechend der Zahlt gewertet
    },
    //Diele Gesamt
    {
        description: 'Diele Gesamt',
        pathOn: ['hm-rpc.1.00171A499D46DC.28.PRESS_SHORT'],
        pathOff: ['hm-rpc.1.00171A499D46DC.29.PRESS_SHORT'],
        pathDimmUp: ['hm-rpc.1.00171A499D46DC.28.PRESS_LONG'],
        pathDimmDown: ['hm-rpc.1.00171A499D46DC.29.PRESS_LONG'],
        pathBWM: ['deconz.0.sensors.00158d0004527786.presence'],
        pathLux: 'deconz.0.sensors.00158d0004527786.lux',
        timerMotion: 180,
        timerSwitch: 3600,
        lights: [4],
        lockBWM: true,
        defaultSwitch: true,
        keyStrokes: 1,
    },

];

//------------------------------------------------------//
//    Hier die Lampen oder Lampengruppen anlegen        //
//------------------------------------------------------//
let arrLights = {
    1: {
        name: 'Büro Spots',                                     // Bezeichnung der Leuchte
        pathControl: 'deconz.0.groups.7.level',                 // Pfad zum Datenpunkt, mit dem die Lampe geschaltet wird. (Brightness oder State)
        pathColortemp: 'deconz.0.groups.7.ct',                  // Pfad zum Datenpunkt, mit dem die Farbtemperatur vorgegeben wird. - sofern vorhanden
        pathTransistion: 'deconz.0.groups.7.transitiontime',    // Pfad zum Datenpunkt, für die Transition Time.
        pathColor: '',                                          // Pfad zum Datenpunkt, für die Farbe. - sofern vorhanden
        defaultLevel: 70,                                       // Default Level-Wert beim Einschalten, sollte kein Zeitplan zutreffen
        defaultColorTemp: 251,                                  // Sofern ein Wert gesetzt ist, Farbtemperatur - sofern vorhanden
        color: '',                                              // Sofern ein Wert gesetzt ist, wird die Lampe entsprechend farbig. - sofern vorhanden
        schedules: [1,2],                                       // Zeitplan-Zuordnung, wann die Leuchte mit welcher Helligkeit leuchtet
        buttonPress: 1,                                         // Bei welchem Tastendruck soll die Lampe reagieren? (Nur rellevant wenn keystrokes > 1)
        emergencyLevel: 50,                                     // Level > 0: Das Licht wird Auslösen des Emergency Datenpunkts auf das eingestellte Level geschaltet
    },
    2: {
        name: 'Ankleide Spots',
        pathControl: 'deconz.0.groups.12.level',                // Pfad zum Datenpunkt, mitdem die Lampe geschaltet wird. (Brightness oder State)
        pathColortemp: 'deconz.0.groups.12.ct',                 // Pfad zum Datenpunkt, mitdem die Lampe geschaltet wird. (Brightness oder State) - sofern vorhanden
        pathTransistion: 'deconz.0.groups.12.transitiontime',   // Pfad zum Datenpunkt, für die Transition Time.
        pathColor: '',                                          // Pfad zum Datenpunkt, für die Farbe. - sofern vorhanden
        defaultLevel: 70,                                       // Default Level-Wert beim Einschalten, sollte kein Zeitplan zutreffen
        defaultColorTemp: 370,                                  // Sofern ein Wert gesetzt ist, Farbtemperatur - sofern vorhanden
        color: '',                                              // Sofern ein Wert gesetzt ist, wird die Lampe entsprechend farbig. - sofern vorhanden
        schedules: [1,2],                                       // Zeitplan-Zuordnung, wann die Leuchte mit welcher Helligkeit leuchtet
        buttonPress: 1,                                         // Bei welchem Tastendruck soll die Lampe reagieren?
        emergencyLevel: 100,                                    // Level > 0: Das Licht wird Auslösen des Emergency Datenpunkts auf das eingestellte Level geschaltet    
    },
    3: {
        name: 'Schlafzimmer Spots',
        pathControl: 'deconz.0.groups.10.level',                // Pfad zum Datenpunkt, mitdem die Lampe geschaltet wird. (Brightness oder State)
        pathColortemp: 'deconz.0.groups.10.ct',                 // Pfad zum Datenpunkt, mitdem die Lampe geschaltet wird. (Brightness oder State) - sofern vorhanden
        pathTransistion: 'deconz.0.groups.10.transitiontime',   // Pfad zum Datenpunkt, für die Transition Time.
        pathColor: '',                                          // Pfad zum Datenpunkt, für die Farbe. - sofern vorhanden
        defaultLevel: 70,                                       // Default Level-Wert beim Einschalten, sollte kein Zeitplan zutreffen
        defaultColorTemp: 370,                                  // Sofern ein Wert gesetzt ist, Farbtemperatur - sofern vorhanden
        color: '',                                              // Sofern ein Wert gesetzt ist, wird die Lampe entsprechend farbig. - sofern vorhanden
        schedules: [1,2],                                       // Zeitplan-Zuordnung, wann die Leuchte mit welcher Helligkeit leuchtet
        buttonPress: 1,                                         // Bei welchem Tastendruck soll die Lampe reagieren?
        emergencyLevel: 100,                                    // Level > 0: Das Licht wird Auslösen des Emergency Datenpunkts auf das eingestellte Level geschaltet    
    },
    4: {
        name: 'Diele Spots Gesamt',
        pathControl: 'deconz.0.groups.9.level',             // Pfad zum Datenpunkt, mitdem die Lampe geschaltet wird. (Brightness oder State)
        pathColortemp: 'deconz.0.groups.9.ct',            // Pfad zum Datenpunkt, mitdem die Lampe geschaltet wird. (Brightness oder State) - sofern vorhanden
        pathTransistion: 'deconz.0.groups.9.transitiontime',    // Pfad zum Datenpunkt, für die Transition Time.
        pathColor: '',                                          // Pfad zum Datenpunkt, für die Farbe. - sofern vorhanden
        defaultLevel: 70,                                       // Default Level-Wert beim Einschalten, sollte kein Zeitplan zutreffen
        defaultColorTemp: 370,                                  // Sofern ein Wert gesetzt ist, Farbtemperatur - sofern vorhanden
        defaultColor: '',                                       // Sofern ein Wert gesetzt ist, wird die Lampe entsprechend farbig. - sofern vorhanden
        schedules: [1,2],                                         // Zeitplan-Zuordnung, wann die Leuchte mit welcher Helligkeit leuchtet
        buttonPress: [1],                                       // Bei welchem Tastendruck soll die Lampe reagieren?
        emergencyLevel: 100,                                    // Level > 0: Das Licht wird Auslösen des Emergency Datenpunkts auf das eingestellte Level geschaltet   
    },
    5: {
        name: 'Wohnzimmer Spots',
        pathControl: 'deconz.0.groups.2.level',                // Pfad zum Datenpunkt, mitdem die Lampe geschaltet wird. (Brightness oder State)
        pathColortemp: 'deconz.0.groups.2.ct',                 // Pfad zum Datenpunkt, mitdem die Lampe geschaltet wird. (Brightness oder State) - sofern vorhanden
        pathTransistion: 'deconz.0.groups.2.transitiontime',   // Pfad zum Datenpunkt, für die Transition Time.
        pathColor: 'deconz.0.groups.2.hue',                     // Pfad zum Datenpunkt, für die Farbe. - sofern vorhanden
        defaultLevel: 70,                                       // Default Level-Wert beim Einschalten, sollte kein Zeitplan zutreffen
        defaultColorTemp: 370,                                  // Sofern ein Wert gesetzt ist, Farbtemperatur - sofern vorhanden
        color: '0',                                              // Sofern ein Wert gesetzt ist, wird die Lampe entsprechend farbig. - sofern vorhanden
        schedules: [1,2],                                       // Zeitplan-Zuordnung, wann die Leuchte mit welcher Helligkeit leuchtet
        buttonPress: 1,                                         // Bei welchem Tastendruck soll die Lampe reagieren?
        emergencyLevel: 100,                                    // Level > 0: Das Licht wird Auslösen des Emergency Datenpunkts auf das eingestellte Level geschaltet    
    },
};

//------------------------------------------------------//
//    Hier die Zeitpläne der Lampen anlegen             //
//------------------------------------------------------//
let arrSchedules = {
    // Zeitplan 1
    1: {start: '07:00', end: '22:00', days: '1-7', brightness: 50, colorTemp: 360, color: '', state: true, name:"Tagsüber von 7-22 Uhr: Helligkeit 50"  },
    // Zeitplan 2
    2: {start: '22:00', end: '07:00', days: '1-7', brightness: 5, colorTemp: 360, color: '', state: true, name:"Nachts von 22-7 Uhr Helligkeit 5" },
    // Zeitplan 3
    3: {start: '05:00', end: '22:00', days: '1-7', brightness: 70, colorTemp: 360, color: '', state: true, name:"Tagsüber von 5-22 Uhr: Helligkeit 70" },
    // Zeitplan 4
    4: {start: '22:00', end: '06:00', days: '1-7', brightness: 0, colorTemp: 360, color: '', state: false, name:"Nachts von 22 - 6 Uhr AUS" },
    // Zeitplan 5
    5: {start: '06:00', end: '21:30', days: '1-7', brightness: 80, colorTemp: 350, color: '', state: true, name:"Nachts von 22-8 Uhr Helligkeit 80" },
    // Zeitplan 6
    6: {start: '21:30', end: '06:00', days: '1-7', brightness: 10, colorTemp: 350, color: '', state: true, name:"Nachts von 21:30-6 Uhr Helligkeit 10" },
    // Zeitplan 7
    7: {start: 'sunrise+15', end: 'sunset', days: '1-7', brightness: 50, colorTemp: 350, color: '', state: true, name:"Von Sonnenaufgang+15min bis -untergang Helligkeit 50" },
    // Zeitplan 8
    8: {start: 'sunset', end: 'sunrise+30', days: '1-7', brightness: 10, colorTemp: 350, color: '', state: true, name:"Von Sonnenuntergang bis -aufgang Helligkeit 10" },
};

// Astrozeiten
// sunrise', 'sunset', 'sunriseEnd', 'sunsetStart', 'dawn', 'dusk', 'nauticalDawn', 'nauticalDusk', 'nightEnd', 'night', 'goldenHourEnd', 'goldenHour'

// Astrozeiten mit Offset in Minuten
// sunrise+30', 'sunset-30', 'sunriseEnd', 'sunsetStart', 'dawn', 'dusk', 'nauticalDawn', 'nauticalDusk', 'nightEnd', 'night', 'goldenHourEnd', 'goldenHour'

//------------------------------------------//
//------------------------------------------//
//     !!!                                  //
//     AB HIER NICHTS MEHR ÄNDERN           //
//     !!!                                  //
//------------------------------------------//
//------------------------------------------//

//******* Input der Gruppen pruefen und ggf. anpassen */
//******* Datenpunkte für Zentralsteuerung */
let dpCount = 0;        //Zähler
let customStates = [];  //Array mit anzulegenden Dps
let lightsFound = [];   //Array für Prüfung mehrere gleichzeitig zugeordneter Lampen

for (const i in arrGroups) {
    if (arrGroups[i].lights.length <= 0) {
        if (logging) console.warn(`${scriptname}: Folgender Gruppe wurden keine Lampen zugeordnet wurde gelöscht: ${(arrGroups[i].name )}`);
        delete arrGroups[i];
    } else {
        arrGroups[i].timerMotion = (arrGroups[i].timerMotion * 1000);   //Sekunden in Millisekunden
        arrGroups[i].timerSwitch = (arrGroups[i].timerSwitch * 1000);   //Sekunden in Millisekunden
        arrGroups[i].buttonPress = 0;                                   //Tastendruck-Zähler Initial auf 1 setzen
        arrGroups[i].dimmLock = false;                                  //Entprellen des Dimmtasters

        let nam = arrGroups[i].description.split(' ').join('_');
        let desc = arrGroups[i].description;

        //Datenpunkte für jede Gruppe definieren
        customStates[dpCount] = {id: statesPath + '.' + nam + '.LightOn', init: true, json: { read: true, write: true, name: 'Licht ' + desc + ' einschalten', type: "boolean", role: "button", def: false }};
        dpCount++;
        customStates[dpCount] = {id: statesPath + '.' + nam + '.LightOff', init: true, json: { read: true, write: true, name: 'Licht ' + desc + ' ausschalten', type: "boolean", role: "button", def: false }};
        dpCount++;
        customStates[dpCount] = {id: statesPath + '.' + nam + '.LightDimmUp', init: true, json: { read: true, write: true, name: 'Licht ' + desc + ' hochdimmen', type: "boolean", role: "button", def: false }};
        dpCount++;
        customStates[dpCount] = {id: statesPath + '.' + nam + '.LightDimmDown', init: true, json: { read: true, write: true, name: 'Licht ' + desc + ' runterdimmen', type: "boolean", role: "button", def: false }};
        dpCount++;
        customStates[dpCount] = {id: statesPath + '.' + nam + '.MotionOnOff', init: false, json: { read: true, write: true, name: 'Licht ' + desc + ' nach Zeitplan ein/aus', type: "boolean", role: "state", def: false }};
        dpCount++;
        customStates[dpCount] = {id: statesPath + '.' + nam + '.GroupInfo.LightState', init: false, json: { read: true, write: false, name: 'Licht ' + desc + ' Status', type: "boolean", role: "state", def: false }};
        dpCount++;
        customStates[dpCount] = {id: statesPath + '.' + nam + '.GroupInfo.MotionState', init: false, json: { read: true, write: false, name: 'Motion ' + desc + ' Status', type: "boolean", role: "state", def: false }};
        dpCount++;
      
        let lights = arrGroups[i].lights;
        for(let j in lights) {
            //Prüfen, ob eine Lampe mehreren Gruppen zugeordnet wurde und ob ButtonPress zu den Keystrokes passt
            if(lightsFound.includes(lights[j])) if (logging) console.warn(`${scriptname}: Lampe ${lights[j]} wurde mehrmals einer Gruppe zugeordnet!`);
            else lightsFound.push(lights[j]);
  
            if(arrGroups[i].keyStrokes <= 1 && arrLights[lights[j]].buttonPress >= 2) {
                arrLights[lights[j]].buttonPress = arrGroups[i].keyStrokes;
                if (logging) console.log(`${scriptname}: ButtonPress von Lampe ${lights[j]} geändert, da Keystrokes in der Gruppe ${arrGroups[i].description} <= 1 ist!`);
            }
           
            //Datenpunkte für alle Lichter innerhalb einer Gruppe definieren
            let light = arrLights[lights[j]];
            let naml = light.name.split(' ').join('_');
            customStates[dpCount] = {id: statesPath + '.' + nam + '.LightsInfo.' + naml + '.LightState', init: false, json: { read: true, write: false, name: 'Status ' + light.name, type: "boolean", role: "state", def: false }};
            dpCount++;
            customStates[dpCount] = {id: statesPath + '.' + nam + '.LightsInfo.' + naml + '.lastValue', init: null, json: { read: true, write: false, name: 'Letzter Wert ' + light.name, type: light.pathControlType }};
            dpCount++;

            //Pfade der Datenpunkte der Lichter zuweisen
            light.pathLightState = statesPath + '.' + nam + '.LightsInfo.' + naml + '.LightState';
            light.pathLastValue = statesPath + '.' + nam + '.LightsInfo.' + naml + '.lastValue';

        }
        //Pfade zu den Datenpunkten der Gruppe zuweisen
        arrGroups[i].pathOn.push(statesPath + '.' + nam + '.LightOn', statesPath + '.' + 'AllLightsOn');
        arrGroups[i].pathOff.push(statesPath + '.' + nam + '.LightOff', statesPath + '.' + 'AllLightsOff');
        arrGroups[i].pathDimmUp.push(statesPath + '.' + nam + '.LightDimmUp');
        arrGroups[i].pathDimmDown.push(statesPath + '.' + nam + '.LightDimmDown');
        arrGroups[i].pathOff.push(statesPath + '.' + nam + '.LightOff', statesPath + '.' + 'AllLightsOff');
        arrGroups[i].pathBWM.push(statesPath + '.' + nam + '.MotionOnOff', statesPath + '.' + 'AllMotionOnOff');
        arrGroups[i].pathLightState = statesPath + '.' + nam + '.GroupInfo.LightState';
        arrGroups[i].pathMotionState = statesPath + '.' + nam + '.GroupInfo.MotionState';
        arrGroups[i].pathEmergency = statesPath + '.EmergencyOnOff'; 
    }
};

//Datenpunkte für Gesamtsteuerung definieren
customStates[dpCount] = {id: statesPath + '.' + 'AllLightsOn', init: true, json: { read: true, write: true, name: 'Alle Lichter einschalten', type: "boolean", role: "button", def: false }};
dpCount++;
customStates[dpCount] = {id: statesPath + '.' + 'AllLightsOff', init: true, json: { read: true, write: true, name: 'Alle Lichter ausschalten', type: "boolean", role: "button", def: false }};
dpCount++;
customStates[dpCount] = {id: statesPath + '.' + 'AllMotionOnOff', init: false, json: { read: true, write: true, name: 'Alle Lichter nach Zeitplan ein/aus', type: "boolean", role: "state", def: false }};
dpCount++;
customStates[dpCount] = {id: statesPath + '.' + 'EmergencyOnOff', init: false, json: { read: true, write: true, name: 'Notlicht ein/aus', type: "boolean", role: "state", def: false }};
dpCount++;

//******* Input der Zeitpläne prüfen und ggf. anpassen */
for (const i in arrSchedules){
    let schedule = arrSchedules[i]
    let input
    schedule.error = false

    // Check Startzeit
    input = getTimeInfoFromAstroString(schedule.start)
    if (!input.found) {
        console.error(`${scriptname}: Folgende Zeitangabe ist fehlerhaft: Zeitplan ${i} => Startzeit "${input.full}". Dieser Zeitplan kann nicht verwendet werden!`);
        schedule.error = true
    } else {
        schedule.startIsAstro = input.isAstro
        schedule.startAstroName = input.astroName
        schedule.startHasOffset = input.astroHasOffset
        schedule.startAstroOffsetMinutes = input.astroOffsetMinutes
        schedule.startHoursMins = input.hoursMins
    }

    // Check Endzeit
    input = getTimeInfoFromAstroString(schedule.end)
    if (!input.found) {
        console.error(`${scriptname}: Folgende Zeitangabe ist fehlerhaft: Zeitplan ${i} => Startzeit "${input.full}". Dieser Zeitplan kann nicht verwendet werden!`)
        schedule.error = true
    } else {
        schedule.endIsAstro = input.isAstro
        schedule.endAstroName = input.astroName
        schedule.endtHasOffset = input.astroHasOffset
        schedule.endAstroOffsetMinutes = input.astroOffsetMinutes
        schedule.endHoursMins = input.hoursMins
    }
}

//******* Input der Lichter pruefen und ggf. anpassen */
for (const i in arrLights) {
    if (!getObject(arrLights[i].pathControl)) {
        console.warn(`${scriptname}: Folgender Pfad ist fehlerhaft und wurde gelöscht: ${(JSON.stringify(arrLights[i].pathControl ))}. Diese Lampe kann nicht gesteuert werden!`);
        delete arrLights[i];
    }
    else {
        if (arrLights[i].pathTransistion && !getObject(arrLights[i].pathTransistion)) {
            if (logging) console.warn(`${scriptname}: Folgender Pfad ist fehlerhaft und wurde gelöscht: ${(JSON.stringify(arrLights[i].pathTransistion ))}. Es kann keine TransitionTime eingestellt werden`);
            arrLights[i].pathTransistion = '';
        }
        else {
            setStateAsync(arrLights[i].pathTransistion, defaultTransition)
        }
        if (arrLights[i].pathColortemp && !getObject(arrLights[i].pathColortemp)) {
            if (logging) console.warn(`${scriptname}: Folgender Pfad ist fehlerhaft und wurde gelöscht: ${(JSON.stringify(arrLights[i].pathColortemp ))}. Es kann keine Farbtemperatur eingestellt werden`);
            arrLights[i].pathColortemp = '';
        }
        if (arrLights[i].pathColor && !getObject(arrLights[i].pathColor)) {
            if (logging) console.warn(`${scriptname}: Folgender Pfad ist fehlerhaft und wurde gelöscht: ${(JSON.stringify(arrLights[i].pathColor ))}. Es kann keine Farbe eingestellt werden!`);
            arrLights[i].pathColor = '';
        }
        //Werte zuweisen
        arrLights[i].defaultTransition = defaultTransition;
        arrLights[i].dimmTransition = 0.4;
        arrLights[i].pathControlType = 'number';
        let tempType = getObject(arrLights[i].pathControl)
        arrLights[i].pathControlType = null;
        arrLights[i].pathControlType = tempType.common.type;

        //Licht Ein mit Standardwerten
        arrLights[i].setLightOn = async function(group){
            if (group.buttonPress == this.buttonPress) {
                setStateAsync(this.pathControl, (this.pathControlType == 'number') ? this.defaultLevel : true)
                if (extLogging) console.log(`${scriptname}: Licht wird eingeschaltet: ${this.name} // Pfad: ${this.pathControl} // Wert: ${(this.pathControlType == 'number') ? this.defaultLevel : true}`);
                setState(this.pathLastValue, (this.pathControlType == 'number') ? this.defaultLevel : true, true);
                setState(this.pathLightState, true, true);
                setState(group.pathLightState, true, true);
            }
        }
        //Licht Aus
        arrLights[i].setLightOff = async function(group){
            setStateAsync(this.pathControl, (this.pathControlType == 'number') ? 0 : false);
            if (extLogging) console.log(`${scriptname}: Licht wird geschaltet: ${this.name} // Pfad: ${this.pathControl} // Wert: ${(this.pathControlType == 'number') ? 0 : false}`);
            setState(this.pathLastValue, (this.pathControlType == 'number') ? 0 : false, true);
            setState(this.pathLightState, false, true);
            setState(group.pathLightState, false, true);
        }
        //Licht Hochdimmen
        arrLights[i].setLightDimmUp = async function(){
            if (this.pathControlType == 'number') {
                var oldValue = await getState(this.pathControl).val;
                let newValue = Math.min(Math.max(oldValue + DimIntervall, 2), 100);
                if(oldValue >=1 && oldValue != 100) {
                    setState(this.pathControl, newValue);
                    if (extLogging) console.log(`${scriptname}: Licht wird hochgedimmt: ${this.name} // Pfad: ${this.pathControl} // Wert: ${newValue}`);
                    setState(this.pathLastValue, newValue, true);
                }
            }
        }
        //Licht Runterdimmen
        arrLights[i].setLightDimmDown = async function(){
            if (this.pathControlType == 'number') {
                 var oldValue = await getState(this.pathControl).val;
                let newValue = Math.min(Math.max(oldValue + (DimIntervall * -1), 2), 100);
                if(oldValue != 2) {
                    setState(this.pathControl, newValue);
                    if (extLogging) console.log(`${scriptname}: Licht wird runtergedimmt: ${this.name} // Pfad: ${this.pathControl} // Wert: ${newValue}`);
                    setState(this.pathLastValue, newValue, true);
                }
            }
        }
        //Licht Ein nach Zeitplan
        arrLights[i].setLightOnSchedule = async function(group){
            for (const y in this.schedules) {
                let schedule = arrSchedules[this.schedules[y]];

                if(!schedule.error) {
                    let startTime = (schedule.startIsAstro) ? getAstroNameTs(schedule.start, schedule.startAstroOffsetMinutes) : schedule.start
                    let endTime = (schedule.endIsAstro) ? getAstroNameTs(schedule.end, schedule.endAstroOffsetMinutes) : schedule.end

                    if (isTimeBetween(startTime, endTime)) {
                        setStateAsync(this.pathControl, (this.pathControlType == 'number') ? schedule.brightness : schedule.state)
                        if (extLogging) console.log(`${scriptname}: Licht wird eingeschaltet: ${this.name} // Pfad: ${this.pathControl} // Wert: ${(this.pathControlType == 'number') ? schedule.brightness : schedule.state} // Zeitplan: ${schedule.name}`);
                        setState(this.pathLastValue, (this.pathControlType == 'number') ? schedule.brightness : schedule.state, true);
                        setState(this.pathLightState, true, true);
                        setState(group.pathLightState, true, true);
                        break;  
                    }
                    else {
                        console.warn(`${scriptname}: Kein Zeitplan hinterlegt für: ${this.name} // Pfad: (${this.pathControl})`);
                    };
                }
                else {
                    console.error(`${scriptname}: Folgende Zeitangabe ist fehlerhaft: Zeitplan ${y}. Dieser Zeitplan kann nicht verwendet werden!`)
                }
            };
        }
        //Notlicht Ein mit Standardwerten
        arrLights[i].setLightEmergencyOn = async function(group){
            if (this.emergencyLevel >= 1) {
                setStateAsync(this.pathControl, (this.pathControlType == 'number') ? this.emergencyLevel : true)
                if (extLogging) console.log(`${scriptname}: Notlicht wird eingeschaltet: ${this.name} // Pfad: ${this.pathControl} // Wert: ${(this.pathControlType == 'number') ? this.emergencyLevel : true}`);
                setState(this.pathLightState, true, true);
                setState(group.pathLightState, true, true);

            }  
        }
        //Notlicht Aus mit Standardwerten
        arrLights[i].setLightEmergencyOff = async function(group){
            if (this.emergencyLevel >= 1) {
                const lastVal = await getStateAsync(this.pathLastValue);
                let lastValue = null;
                lastValue = (lastVal.val != null) ? lastVal.val : (this.pathControlType == 'number') ? 0 : false;            

                setStateAsync(this.pathControl, lastValue)
                if (extLogging) console.log(`${scriptname}: Notlicht wird ausgeschaltet: ${this.name} // Pfad: ${this.pathControl} // Wert: ${lastValue}`);
                if(lastValue){
                    setState(this.pathLightState, true, true);
                    setState(group.pathLightState, true, true);
                } else {
                    setState(this.pathLightState, false, true);
                    setState(group.pathLightState, false, true);
                }
            }  
        }
        arrLights[i].setLightParameter = async function(brightness, colorTemp, color){
            let actualState = await getStateAsync(this.pathLightState)
            if (actualState.val && brightness) {
                if (this.pathControlType == 'number') setStateAsync(this.pathControl, brightness)
            } 
            if (this.pathColortemp && colorTemp) setStateAsync(this.pathColortemp, colorTemp)
            if (this.pathColor && color) setStateAsync(this.pathColor, color)
            if (extLogging) console.log(`${scriptname}: Licht-Parameter wurden gesetzt: ${this.name}`);
        }
    }
};

//******* Alle States anlegen, createTrigger aufrufen wenn fertig */
let numStates = customStates.length;

customStates.forEach(function (state) {
    createStateAsync(state.id, state.init, state.json, function () {
        numStates--;
        if (numStates === 0) {
            if (logging) console.log(`${scriptname}: CreateStates fertig!`);
            for (const i in arrGroups) { //Channels erstellen
                let x = arrGroups[i].description.split(' ').join('_');
                setObjectAsync(statesPath + '.' + x, { type: 'channel', common: { name: arrGroups[i].description }, native: {} });
                setObjectAsync(statesPath + '.' + x + '.' + 'LightsInfo', { type: 'channel', common: { name: 'Licht Informationen ' + arrGroups[i].description }, native: {} });
                setObjectAsync(statesPath + '.' + x + '.' + 'GroupInfo', { type: 'channel', common: { name: 'Gruppen Informationen ' + arrGroups[i].description }, native: {} });
            };
            createTrigger(arrGroups, arrLights);
            createSchedules(arrLights, arrSchedules);
        };
    });
});

//******* Logeintrag mit Scriptnamen, Version und Developer */
console.log(`${scriptname} ${version} ${constri}`);

//--------------------------------------//
//      Create Triggers                 //
//--------------------------------------//
/**
 * Erzeugen der Zeitpläne für Farbtemperatur, Farbe und Helligkeit
 * 
 * @param {object}  arrLights - Object mit allen Lichtern
 * @param {object}  arrSchedules - Object mit allen Zeitplänen
 */
async function createSchedules(arrLights, arrSchedules) {
    for (const i in arrSchedules) {
        let sched = arrSchedules[i]

        if (!sched.error) {   
            if (!sched.startIsAstro) {
                if (extLogging) console.log(`Scheduler ${i} ist Uhrezeit. Zusammensetzung des Cron-Expressions`)
                let h = (sched.startHoursMins[1] != '00') ? sched.startHoursMins[1] : '0'
                let m = (sched.startHoursMins[3] != '00') ? sched.startHoursMins[3] : '0'
                let d = (sched.days = '1-7') ? '*' : sched.days
              
                schedule(m + ' ' + h + ' * * ' + d, async function () {
                    //Schleife durch alle Lichter
                    for (const y in arrLights) {
                        let light = arrLights[y]
                        //Schleife durch alle zugeordneten Zeitplänen
                        for (const n in light.schedules) {
                            //Prüfen, ob Lampe dem Zeitplan zugeorndet ist
                            if (i == light.schedules[n]) {
                                //Falls ja, dann Parameter der Lampe setzen
                                light.setLightParameter(sched.brightness, sched.colorTemp, sched.color)
                                if (logging) console.log(`${scriptname}: Scheduler für Zeitplan ${i} wurde ausgelöst.`);
                            }
                        }
                    }
                })
            }
            else {
                if (extLogging) console.log(`Scheduler ${i} ist Astrozeit. Zusammensetzung des Cron-Expressions`)
                
                schedule({astro: sched.startAstroName, shift: sched.startAstroOffsetMinutes}, async function () {
                    //Schleife durch alle Lichter
                    for (const y in arrLights) {
                        let light = arrLights[y]
                        //Schleife durch alle zugeordneten Zeitplänen
                        for (const n in light.schedules) {
                            //Prüfen, ob Lampe dem Zeitplan zugeorndet ist
                            if (i == light.schedules[n]) {
                                //Falls ja, dann Parameter der Lampe setzen
                                light.setLightParameter(sched.brightness, sched.colorTemp, sched.color)
                                if (logging) console.log(`${scriptname}: Scheduler für Zeitplan ${i} wurde ausgelöst.`);
                            }
                        }
                    }
                })
            }
        }
    }
}

//--------------------------------------//
//      Create Trigger Taster, Motion   //
//--------------------------------------//
/**
 * Erzeugen aller nötigen Trigger
 * 
 * @param {array}    arrGroups - Array mit allen Gruppen
 * @param {object}   lights - Object mit allen Lichtern
 */
async function createTrigger(arrGroups, lights) {

    arrGroups.forEach(function async(objTemp) {
 
        //--------------------------------------//
        //      Trigger Licht Taster ein        //
        //--------------------------------------//
        if(objTemp.pathOn) {
            on({ id: objTemp.pathOn, val: true }, function async(obj) {
                if (logging) console.log(`${scriptname}: Taster Licht EIN für Gruppe ${objTemp.description} wurde betätigt. // Objekt: ${obj.id}`);
                
                //Timeouts zurücksetzen
                stopTimeout(objTemp);

                //BWM Sperren
                if (objTemp.lockBWM) {
                    objTemp.switch = true;
                    if(logging)console.log(`${scriptname}: Bewegungsmelder für Gruppe ${objTemp.description} wurden gesperrt`);
                } 
                
                //Safety Timeout wird gestartet, sofern die Timeout-Zeit größer/gleich 1 ist
                if (objTemp.timerSwitch >= 1) {
                    objTemp.safetyTimeout = setTimeout(async () => {
                        if(logging) console.log(`${scriptname}: Safety Timeout von ${objTemp.pathOff} Wert: ${objTemp.safetyTimeout}`);
                        for (const n in objTemp.lights) {
                            let light = lights[objTemp.lights[n]];
                            light.setLightEmergencyOff(objTemp);
                        } 
                    }, objTemp.timerSwitch);
                };

                //Tastendruck-Zähler hochsetzen, sofern mehrere Tastendrücke der Gruppe zugeordnet sind
                if (objTemp.buttonPress < objTemp.keyStrokes && objTemp.buttonPress != objTemp.keyStrokes) objTemp.buttonPress++;

                //Licht einschalten
                for (const n in objTemp.lights) {
                    let light = lights[objTemp.lights[n]];
                    (objTemp.defaultSwitch) ? light.setLightOn(objTemp) : light.setLightOnSchedule(objTemp)
                }
                //Status der Gruppe setzen
                setStateAsync(objTemp.pathLightState, true, true);
            });
        };

        //--------------------------------------//
        //      Trigger Licht Taster aus        //
        //--------------------------------------//
        if(objTemp.pathOff) {
            on({ id: objTemp.pathOff, val: true }, async function (obj) {  // Trigger Licht aus
                if(logging) console.log(`${scriptname}: Taster Licht AUS für Gruppe ${objTemp.description} wurde betätigt. Objekt: ${obj.id}`);
                
                //Timeouts zurücksetzen
                stopTimeout(objTemp);

                //Bewegungsmelder für 2 Sekunden sperren, wenn das Licht manuell ausgeschaltet wurde
                objTemp.switch = true;
                if(logging) console.log(`${scriptname}: 2 Sekunden Sperre für BWM der Gruppe ${objTemp.description}`);
                
                objTemp.bwmBreakTimeout = setTimeout(async () => {
                    objTemp.switch = false;
                    if(logging) console.log(`${scriptname}: Bewegungsmelder für Gruppe ${objTemp.description} wurden freigegeben`);
                }, 2000);

                //Tastendruckzähler zurücksetzen
                objTemp.buttonPress = 0
             
                //Licht ausschalten
                for (const n in objTemp.lights) {
                    let light = lights[objTemp.lights[n]];
                    light.setLightOff(objTemp);
                }
                //Status der Gruppe setzen
                setStateAsync(objTemp.pathLightState, false, true);
            });
        };

        //--------------------------------------//
        //      Trigger Licht hochdimmen      //
        //--------------------------------------//
        if(objTemp.pathDimmUp) {
            on({ id: objTemp.pathDimmUp, val: true }, async function (obj) {  // Trigger Dimmen Hoch
                if(logging) console.log(`${scriptname}: Taster Licht hochdimmen für Gruppe ${objTemp.description} wurde betätigt. Objekt: ${objTemp.pathDimmUp}`);
                
                //BWM Sperren
                if (objTemp.lockBWM) {
                    objTemp.switch = true;
                    if(logging)console.log(`${scriptname}: Bewegungsmelder für Gruppe ${objTemp.description} wurden gesperrt`);
                } 

                // Dimmtaster entprellen
                if(!objTemp.dimmLock) {
                    objTemp.dimmLock = true;
                    
                    //Licht dimmen
                    for (const n in objTemp.lights) {
                        let light = lights[objTemp.lights[n]];
                        light.setLightDimmUp();
                    }
                    objTemp.dimmLockTimeout = setTimeout(async () => {
                        objTemp.dimmLock = false;    
                    }, 400);
                }      
            });
        };

        //--------------------------------------//
        //      Trigger Licht runterdimmen      //
        //--------------------------------------//
        if(objTemp.pathDimmDown) {
            on({ id: objTemp.pathDimmDown, val: true }, async function (obj) {  // Trigger Dimmen Runter
                if(logging) console.log(`${scriptname}: Taster Licht runterdimmen für Gruppe ${objTemp.description} wurde betätigt. Objekt: ${objTemp.pathDimmDown}`);        
                
                //BWM Sperren
                if (objTemp.lockBWM) {
                    objTemp.switch = true;
                    if(logging)console.log(`${scriptname}: Bewegungsmelder für Gruppe ${objTemp.description} wurden gesperrt`);
                } 
                
                // Dimmtaster entprellen
                if(!objTemp.dimmLock) {
                    objTemp.dimmLock = true;
                    //Licht dimmen
                    for (const n in objTemp.lights) {
                        let light = lights[objTemp.lights[n]];
                        light.setLightDimmDown();
                    }
                    objTemp.dimmLockTimeout = setTimeout(async () => {
                        objTemp.dimmLock = false;    
                    }, 400);
                }   
            });
        };

        //--------------------------------------//
        //      Trigger Licht Bewegungsmelder   //
        //--------------------------------------//
        if(objTemp.pathBWM) {            
            on({ id: objTemp.pathBWM, change: "any", ack: true}, async function (obj) {

                if(logging) console.log(`${scriptname}: Ein Bewegungsmelder der Gruppe ${objTemp.description} hat ausgelöst. // BWM: ${obj.channelName} // Object: ${obj.id} State: // ${obj.state.val}`);

                //Timeouts zurücksetzen
                stopTimeout(objTemp);

                //Motiostate alle BWMs abgleichen
                objTemp.Motionstate = false; //Motionstate initial auf false setzen, wird bei auch nur einem aktiven Bwm mit true überschrieben
                for (const i in objTemp.pathBWM) { // Alle BWMs der Gruppe prüfen, false setzen wenn ALLE false, true wenn EINER true
                    if (getState(objTemp.pathBWM[i]).val) {
                        objTemp.Motionstate = true;
                        setState(objTemp.pathMotionState, true, true);
                        if(extLogging) console.log(`${scriptname}: Motionstate: ${objTemp.Motionstate} von BWM: ${obj.channelName}`);
                    };
                };

                //Prüfen, ob BWM Sperre existiert
                objTemp.switch = (objTemp.switch != null) ? objTemp.switch : false;
                if(logging) console.log(`${scriptname}: BWM Sperre ist: ${objTemp.switch}`);

                //Wenn Sperre nicht aktiv, dann darf der BWM arbeiten
                if(!objTemp.switch){
                    
                    //Lux Abfrage
                    const luxVal = await getStateAsync(objTemp.pathLux);
                    let luxValue = 0;
                    luxValue = luxVal.val;
                    if(extLogging) console.log(`${scriptname}: Aktueller Lux-Wert: ${luxValue}`);
            
                    // Was passiert bei TRUE oder FALSE des BWMs
                    if(objTemp.Motionstate){   // Wenn ein BMW auf True steht und Licht ist aus
                        if(!getState(objTemp.pathLightState).val && luxValue <= luxThreshold) {
                            //Licht ein nach Zeitplan
                            for (const n in objTemp.lights) {
                                let light = lights[objTemp.lights[n]];
                                light.setLightOnSchedule(objTemp);
                            }  
                        }
                    }
                    else{ // Wenn kein BWM mehr auf true steht
                        objTemp.Timeout = setTimeout(async () => {
                            //Licht ein nach Zeitplan
                            for (const n in objTemp.lights) {
                                let light = lights[objTemp.lights[n]];
                                light.setLightOff(objTemp);
                            } 
                            //Tastendruckzähler zurücksetzen
                            objTemp.keystrokeCounter = 0
                        }, objTemp.timerMotion);
                        //Motionstate zurücksetzen
                        setState(objTemp.pathMotionState, false, true);
                        if(logging) console.log(`${scriptname}: Motionsensor hat keine Bewegung mehr erkannt. Timer wird gestartet: ${objTemp.Timeout}`);
                    }
                } else {
                    if(extLogging) console.log(`${scriptname}: BWM Sperre ${objTemp.switch}`);
                }
            }); 
        };

       //--------------------------------------//
        //      Trigger Notlicht ein/aus       //
        //-------------------------------------//

        if(objTemp.pathEmergency) {            
            on({ id: objTemp.pathEmergency, change: "ne"}, function async(obj) {
                
                var value = obj.state.val;

                //Prüfen ob CustomState und ggf. bestätigen
                setAck(obj);
                
                //Wenn Wert = True
                if (value) {
                    if (logging) console.log(`${scriptname}: Notlicht wurde betätigt. // Objekt: ${obj.id} // Gruppe: ${objTemp.description}`)
                    
                    //Timeouts stoppen
                    stopTimeout(objTemp);
                    
                    //BWM Sperren
                    objTemp.switch = true;
                    console.log(`${scriptname}: Bewegungsmelder für Gruppe ${objTemp.description} wurden gesperrt`);

                    //Lichter einschalten
                    for (const n in objTemp.lights) {
                        let light = lights[objTemp.lights[n]];
                        light.setLightEmergencyOn(objTemp);
                    } 
                }
                //Wenn Value False
                else {
                    for (const n in objTemp.lights) {
                        let light = lights[objTemp.lights[n]];
                        light.setLightEmergencyOff(objTemp);
                    } 
                    //BWM Entperren
                    objTemp.switch = false;
                    console.log(`${scriptname}: Bewegungsmelder für Gruppe ${objTemp.description} wurden entsperrt`);
                    
                    //Safety Timeout wird gestartet, sofern die Timeout-Zeit größer/gleich 1 ist
                    if (objTemp.timerSwitch >= 1) {
                        objTemp.safetyTimeout = setTimeout(async () => {
                            if(logging) console.log(`${scriptname}: Safety Timeout von ${objTemp.pathOff} Wert: ${objTemp.safetyTimeout}`);
                            for (const n in objTemp.lights) {
                                let light = lights[objTemp.lights[n]];
                                light.setLightOff(objTemp);
                            } 
                        }, objTemp.timerSwitch);
                    };
                };
            });
        };
    });
};

//----------------------//
//                      //
//      Funktionen      //
//                      //
//----------------------//

/**
 * Checks if time of '08:30' is between '23:00' and '09:00'.
 * Source/inspired by: https://github.com/Mic-M/ioBroker.smartcontrol/blob/master/lib/helper.js
 * 
 * @param {string}    start - start string, like: '23:00', '07:30', 9:15'
 * @param {string}    end   - end string, like: '08:15', '17:23'
 * @return {boolean}  true if in between, false if not
 * 
 */
function isTimeBetween (start, end) {

    let check = formatDate(new Date(), "hh:mm");

    const timeIsBetween = function(start, end, check) {
        return (start.hour <= end.hour) ? check.isGreaterThan(start) && !check.isGreaterThan(end)
            : (check.isGreaterThan(start) && check.isGreaterThan(end)) || (!check.isGreaterThan(start) && !check.isGreaterThan(end));    
    };

    function getTimeObj (timeString) {
        const t = timeString.split(':');
        const returnObject = {};
        returnObject.hour = parseInt(t[0]);
        returnObject.minutes = parseInt(t[1]);
        returnObject.isGreaterThan = function(other) { 
            return (returnObject.hour > other.hour) || (returnObject.hour === other.hour) && (returnObject.minutes > other.minutes);
        };
        return returnObject;
    }

    return timeIsBetween(getTimeObj(start), getTimeObj(end), getTimeObj(check));

}

/**
 * Zeit ermitteln.
 * Source/inspired by: https://github.com/Mic-M/ioBroker.smartcontrol/blob/master/lib/helper.js
 * 
 * @param {string}    input - start string, like: '23:00', 'sunset', 'sunrise-30'
 * @return {object}   
 * 
 */
function  getTimeInfoFromAstroString(input) {

    input = input.replace(/\s/g,''); // remove all white spaces
    if(extLogging) console.log(`${scriptname}: Zeitumwandlung gestartet mit folgendem Input: ${(input)}`)
    
    const returnObject = {
        full: input,
        found: true,
        hoursMins: null, // like '19:35'
        hour: 0,
        minute: 0,
        isAstro: false,
        astroName: '',
        astroHasOffset: false,
        astroOffsetMinutes: 0,
    };

    const matchTime = input.match(/^(\d{1,2})(:)(\d{2})$/);
    const matchAstroName = input.match(/^(sunriseEnd|sunrise|goldenHourEnd|solarNoon|goldenHour|sunsetStart|sunset|dusk|nauticalDusk|nightEnd|nadir|night|nauticalDawn|dawn)$/g);
    const matchAstroWithOffset = input.match(/^(sunriseEnd|sunrise|goldenHourEnd|solarNoon|goldenHour|sunsetStart|sunset|dusk|nauticalDusk|nightEnd|nadir|night|nauticalDawn|dawn)(-|\+)(\d{1,3})$/);

    
    if (matchTime != null) {
        //Keine Astrozeit
        if(extLogging) console.warn(`${scriptname}: Zeitumwandlung: Uhrzeit gefunden: ${(matchTime)}`)
        
        const hour = parseInt(matchTime[1]);
        const min = parseInt(matchTime[3]);

        if ( (input != '24:00') && (hour < 0 || hour > 23 || min < 0 || min > 60 ) ) {
            console.error(`${scriptname}: Zeitumwandlung: Fehler in der Zeitangabe ${(matchTime)}`)
            returnObject.full = input
        } else {
            returnObject.hoursMins = matchTime
        }
    } 
    else {
        if (matchAstroName != null) {
            // Astrozeit ohne Offset
            if(extLogging) console.log(`${scriptname}: Zeitumwandlung: Astrozeit ohne Offset gefunden: ${(matchAstroName)}`)
            returnObject.astroName = input;
            returnObject.isAstro = true;
            returnObject.hoursMins = getAstroNameTs(input)

        } else if (matchAstroWithOffset != null) {
            // Astrozeit mit Offset
            if(extLogging) console.log(`${scriptname}: Zeitumwandlung: Astrozeit mit Offset gefunden: ${(matchAstroWithOffset)}`)
            returnObject.isAstro = true;
            returnObject.astroHasOffset = true;
            returnObject.hoursMins = returnObject.hoursMins = getAstroNameTs(matchAstroWithOffset[1],)
            returnObject.astroName = matchAstroWithOffset[1];
            returnObject.astroOffsetMinutes = parseInt(matchAstroWithOffset[3]);
            if(matchAstroWithOffset[2] == '-') {
                returnObject.astroOffsetMinutes = returnObject.astroOffsetMinutes * (-1);
            }
            returnObject.hoursMins = returnObject.hoursMins = getAstroNameTs(returnObject.astroName, returnObject.astroOffsetMinutes)
                   
        } else {
            // Nothing found
            if(extLogging) console.log(`${scriptname}: Zeitumwandlung: nichts gefunden`)
            returnObject.found = false
        }
    }
    // handle '24:00'
    if (input == '24:00') {
        returnObject.hoursMins = '00:00';
    }
    
    return returnObject;
}

/**
 * Get the Time String of an astro name.
 * 
 * @param {string} astroName            Name of sunlight time, like "sunrise", "nauticalDusk", etc.
 * @param {number} [offsetMinutes=0]    Offset in minutes
 * @return {string}                     TimeString of the astro name
 */
function getAstroNameTs(astroName, offsetMinutes=0) {
    return formatDate(getDateObject(getAstroDate(astroName, undefined, offsetMinutes)), "hh:mm");
}

/**
 * Prüfen ob CustomState und ggf. bestätigen
 * 
 * @param {object}    obj - Object from Trigger
 */
async function setAck(obj) {
    if (!obj.state.ack) setStateAsync(obj.id, obj.state.val, true);
}

/**
 * Stoppt alle nötigen Timeouts, bevor diese erneut gestartet werden
 * 
 * @param {object}    objTemp - Object der aktuellen Gruppe
 */
async function stopTimeout(objTemp) {
    //Safety Timeout zurücksetzen
    if (objTemp.safetyTimeout != null) {
        if(logging) console.log(`${scriptname}: Reset des Safety Timeout von ${objTemp.pathOn} Wert: ${objTemp.safetyTimeout}`);
        clearTimeout(objTemp.safetyTimeout);
        objTemp.safetyTimeout = null;
    };
    //BWM Timeout zurücksetzen
    if (objTemp.Timeout != null) {
        if(logging) console.log(`${scriptname}: Reset Timeout BWM // Wert: ${objTemp.Timeout}`);
        clearTimeout(objTemp.Timeout);
        objTemp.Timeout = null;
    };
}
