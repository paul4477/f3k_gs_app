const SerialPort = require('serialport');




//Extended Protocol for displays programmed to show round, group and time data.
//This format has been created for a pilot who plans to share information about his display before December 2018.
//                     0123456789012345
//The output format is R99G99T9999+AA+CR
//R99 - 99 is replaced by the round number
//G99 - 99 is replaced by the group number
//T9999 - 9999 is replaced by two characters for minutes and two characters for seconds
//AA - two character code for the timer state (PT prep time; WT working time: LT landing time; ST sleep time; DT display time-of-day)
//This allows for the possibility of changing the display colour according to the timer state.
//CR is the ascii character for Carriage Return.
//A typical output string could be R09G01T0652WT+CR

var runningSlot = {
    // All times are server time
    // TimeSync.js is needed on client to manage sync with server time
    raw: "ST", // PT, WT, LT, ST, DT
    group: 0,
    round: 0,
    endTimes: [],
    maxTimes: 10,
    canFly: false,
    type: null,
    get endTime() {
        // Running average of contents of endTimes
        return this.endTimes.reduce((all, one, _, src) => all += one / src.length, 0);
    },
    set rawType(typeString) {
        this.raw = typeString;

        switch (typeString) {
            case "ST":
                this.type = "Sleep";
                this.canFly = true;
                break;
            case "ER":
                this.type = "Error";
                this.canFly = true;
                break;

            case "PT":
                this.type = "Prep";
                this.canFly = true;
                break;
            case "WT":
                this.type = "Work";
                this.canFly = true;
                break;
            case "LT":
                this.type = "Land";
                this.canFly = false;
                break;
            case "DT":
                this.type = "- - -";
                this.canFly = false;
                this.endTimes = [];
                break;
            case "NF":
                this.type = "No Fly";
                this.canFly = false;
                break;
            default:
                this.type = this.raw;
                this.canFly = false;
                break;
        }
    },
    manageEndTimes: function (mmssString) {
        minutes = parseInt(mmssString.slice(0, 2)) * 60;
        seconds = parseInt(mmssString.slice(2, 4));
        // Convert to miliseconds
        endTime = Date.now() + ((minutes + seconds) * 1000);
        this.endTimes.push(endTime);

        //if (minutes + seconds = 0) { while (this.endTime.length > 1) { this.endTime.shift()}};
        if (minutes + seconds == 0) { this.endTimes = [] };
        // Pop (fifo) time from endTimes
        if (this.endTimes.length > this.maxTimes) { this.endTimes.shift() };

    },
    update: function (buffer) {
        // Parse buffer direct from serial port
        s = buffer.toString();
        // TODO: Check format
        // Compare to regex and throw error if no match
        this.round = s.slice(1, 3);
        this.group = s.slice(4, 6);
        this.rawType = s.slice(12, 14);
        this.manageEndTimes(s.slice(7, 11));
    }
};

const config = require('config');


const port = new SerialPort(config.get('serial'), function (err) {
    if (err) {
        runningSlot.update("R00G00T0000+DT+\n")
        return console.log('Error: ', err.message)
    }
});

port.on('data', (data) => {

    runningSlot.update(data);
    //console.log(runningSlot.endTime);
    //end = new Date(runningSlot.endTime);
    //end = new Date(0);
    //console.log(runningSlot.endTime);
    //console.log(`Round: ${runningSlot.round} Group: ${runningSlot.group} : ${end}`);
    //if (runningSlot.canFly) { console.log('Status: Fly');}
    //else {console.log('Status: Don\'t Fly');}

    //console.log(Date(0));
});


module.exports = runningSlot;