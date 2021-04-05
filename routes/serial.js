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

let endTimes = []

var runningSlot = {
    // All times are server time
    // TimeSync.js is needed on client to manage sync with server time
    raw: "ST", // PT, WT, LT, ST, DT
    group: 0,
    round: 0,
//    endTimes: [],
    maxTimes: 5,
    canFly: false,
    type: null,
    get endTime() {
        // Running average of contents of endTimes
        return endTimes.reduce((all, one, _, src) => all += one / src.length, 0);
    },
    set rawType(typeString) {
        this.raw = typeString
        endTimes = []

        switch (typeString) {
            case "ST":
                this.type = "- - -"; //"Sleep"
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
                break;
            case "NF":
                this.type = "No Fly";
                this.canFly = false;
                break;
            case "PA":
                this.type = "Paused";
                this.canFly = false;
                break;
            default:
                this.type = this.raw;
                this.canFly = false;
                break;
        }
    },
    manageEndTimes: function (mmssString) {
        // We've emptied the endTimes array when paused.

        if (this.raw != 'PA' && this.raw != 'DT') {

            minutes = parseInt(mmssString.slice(0, 2)) * 60;
            seconds = parseInt(mmssString.slice(2, 4));
            console.log(mmssString, minutes, seconds);
            // Convert to miliseconds
            endTime = Date.now() + 1000 + ((minutes + seconds) * 1000);
            //endTime += 1000; // Correct off by one error
            endTimes.push(endTime);

            //if (minutes + seconds = 0) { while (this.endTime.length > 1) { this.endTime.shift()}};
            if (minutes + seconds == 0) { endTimes = [] };
            // Pop (fifo) time from endTimes
            if (endTimes.length > this.maxTimes) { endTimes.shift() };
            console.log(this.endTime);
        }
    },
    update: function (buffer) {
        // Parse buffer direct from serial port
        //console.log(buffer);
        s = buffer.toString()
        // TODO: Check format
        // Compare to regex and throw error if no match
        this.round = s.slice(1, 3)
        this.group = s.slice(4, 6)
        const newType = s.slice(12, 14)
        if (newType != this.raw) {
            this.rawType = newType
        }
        
        this.manageEndTimes(s.slice(7, 11))
        // Push SSE
        sendSlotToAll();
    }
};

const config = require('config');

// Try to open serial port, most likely this will not be used
const port = new SerialPort(config.get('serial'), function (err) {
    if (err) {
        runningSlot.update("R00G00T0000+DT+\n")
        return console.error('Error: ', err.message)
    }
});

port.on('data', (data) => {
    runningSlot.update(data);
});


const eventsRouter = require('express').Router({ mergeParams: true });

// /api/events

// Get competition list
eventsRouter.get('/', async (req, res) => {
    // Mandatory headers and http status to keep connection open
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };
    res.writeHead(200, headers);

    // After client opens connection send all nests as string
    const data = `data: ${JSON.stringify(runningSlot)}\n\n`;
    res.write(data);

    // Generate an id based on timestamp and save res
    // object of client connection on clients list
    // Later we'll iterate it and send updates to each client
    const clientId = Date.now();
    const newClient = {
        id: clientId,
        res
    };
    clients.push(newClient);

    // When client closes connection we update the clients list
    // avoiding the disconnected one
    req.on('close', () => {
        console.log(`${clientId} Connection closed`);
        clients = clients.filter(c => c.id !== clientId);
    });
});

function sendSlotToAll() {
    console.log("Sending to", clients.length, "clients.")
    //console.log(clients[0]);
    //console.log(`${JSON.stringify(runningSlot)}\n\n`)
    clients.forEach(c => c.res.write(`data: ${JSON.stringify(runningSlot)}\n\n`))
}

let clients = [];

module.exports = { runningSlot, eventsRouter }