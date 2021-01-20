const version = `v 0.1`
const scriptname = `LightOnOffPresence Script`
const constri = `Schmakus`

let ZeitMin = '06:00';
let ZeitMax = '22:00';
let TransitionTime = 1;
let DimIntervall = 10;
let Threshold = 15;

const arrGroups = [
    //Test
    {
        pathLevel: 'zigbee.0.00158d000448b30d.brightness',
        pathColortemp: 'zigbee.0.00158d000448b30d.colortemp',
        pathTransistion: 'zigbee.0.00158d000448b30d.transition_time',
        pathOn: 'hm-rpc.1.00171A499D46DC.32.PRESS_SHORT', 
        pathOff: 'hm-rpc.1.00171A499D4685.1.PRESS_SHORT', 
        pathDimmup: 'hm-rpc.1.00171A499D46DC.32.PRESS_LONG', 
        pathDimmdown: 'hm-rpc.1.00171A499D4685.1.PRESS_LONG',
        pathBWM: 'zigbee.0.00158d0004514986.occupancy',
        pathLux: 'zigbee.0.00158d0004514986.illuminance',
        colorTemp: 251,
        timer: 180,
        levelDay: 80,
        levelNight: 10,
    },
    //Büro
    {
        pathLevel: 'zigbee.0.group_5.brightness',
        pathColortemp: 'zigbee.0.group_5.colortemp',
        pathTransistion: 'zigbee.0.group_5.transition_time',
        pathOn: 'hm-rpc.1.00171A499D46DC.32.PRESS_SHORT', 
        pathOff: 'hm-rpc.1.00171A499D4685.1.PRESS_SHORT', 
        pathDimmup: 'hm-rpc.1.00171A499D46DC.32.PRESS_LONG', 
        pathDimmdown: 'hm-rpc.1.00171A499D4685.1.PRESS_LONG',
        pathBWM: ['zigbee.0.00158d0004514986.occupancy', 'zigbee.0.00158d0004514986.occupancy'],
        pathLux: 'zigbee.0.00158d0004514986.illuminance',
        colorTemp: 251,
        timer: 180,
        levelDay: 80,
        levelNight: 10,
    },
];

console.log(`${scriptname} ${version} ${constri}`);

createTrigger(arrGroups);

async function createTrigger(arrGroups) {
    arrGroups.forEach(function (objTemp) {
        on({ id: objTemp.pathOn, change: "any" }, function async(obj) {    // Trigger Licht an
            
           setLight(objTemp, objTemp.levelDay, TransitionTime );

            /*
            if (compareTime(objTemp.ZeitMin, objTemp.ZeitMax, "between", null)) {
                setLight(objTemp.pathLevel, objTemp.pathColortemp, objTemp.levelDay, TransitionTime );
            } else {
                setLight(objTemp.pathLevel, objTemp.pathColortemp, objTemp.levelNight, TransitionTime );
            }
            */
        });

        on({ id: objTemp.pathOff, change: "any" }, async function (obj) {  // Trigger Licht aus

            if (objTemp.Timeout != null) {
                clearTimeout(objTemp.Timeout);
                objTemp.Timeout = null;
            };
      
            if (lastValue !== 0) {
                setLight(objTemp, 0, TransitionTime );
            };
        });

        on({ id: objTemp.pathDimmup, change: "any" }, async function (obj) {  // Trigger Dimmen Hoch

            const lastVal = await getState(objTemp.pathLevel);
            let lastValue = 0;
            lastValue = lastVal.val;           

            let DimmValue = Math.min(Math.max(lastValue + DimIntervall, 1), 100);
            TransitionTime = 0.4;
   
            if (lastValue !== DimmValue) {
                setLight(objTemp, DimmValue, TransitionTime );
            };
        });

        on({ id: objTemp.pathDimmDown, change: "any" }, async function (obj) {  // Trigger Dimmen Runter

            const lastVal = await getState(objTemp.pathLevel);
            let lastValue = 0;
            lastValue = lastVal.val;           

            let DimmValue = Math.min(Math.max(lastValue + DimIntervall, 1), 100);
            TransitionTime = 0.4;
           
            if (lastValue !== DimmValue) {
                setLight(objTemp, DimmValue, TransitionTime );
            };
        });      
    });
};

// Level-Wert setzen
async function setLight(objTemp, level, TransitionTime) {
    
    console.warn(`${objTemp.pathLevel}: ${level}`);

    let val = await getState(objTemp.pathLevel).val; // Aktuellen Level-Wert der Lampe holen
    
    setState(objTemp.pathTransistion, TransitionTime);
    
    if (getObject(objTemp.pathColortemp)) {
        setState(objTemp.pathColortemp, objTemp.colorTemp);
    };
    
    setState(objTemp.pathLevel, level);  
};
