const Logging = require("./logging");
const Connection = require("./connection");
const {WebSocketServer} = require("ws");
const UUID = require("node-uuid");

const wss = new WebSocketServer({port: 8088});

const Connections = [];
wss.on("connection", ws => {

    // Accepting connection.
    Logging.logMessage("Establishing new connection...");
    const index = Connections.findIndex(c => c.ws === ws);
    if(index > -1) {
        Connections.splice(index, 1);
    }
    const uuid = UUID().v4();
    Connections.push(new Connection(uuid, ws));
    Logging.logMessage(`${uuid}: connection established.`);

    // Disconnections.
    ws.on("close", () => {
        Logging.logMessage(`${uuid}: disconnected.`);
        const index = Connections.findIndex(c => c.uuid === uuid);
        if(index > -1) {
            Connections.splice(index, 1);
        }
    });
});