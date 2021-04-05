const eventsRouter = require('express').Router({ mergeParams: true });
const serialSlot = require('./serial');


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
    const data = `${JSON.stringify(serialSlot)}\n\n`;
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
    clients.forEach(c => c.res.write(`${JSON.stringify(serialSlot)}\n\n`))
}

let clients = [];

module.exports = eventsRouter;