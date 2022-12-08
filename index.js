const Logging = require("./logging");
const Connection = require("./connection");
const {WebSocketServer} = require("ws");
const UUID = require("node-uuid");
const Message = require("./message");

const wss = new WebSocketServer({port: 8088});

const Connections = [];
const Messages = [];
wss.on("connection", ws => {

    // Accepting connection.
    Logging.logMessage("Establishing new connection...");
    const index = Connections.findIndex(c => c.ws === ws);
    if(index > -1) {
        Connections.splice(index, 1);
    }
    const uuid = UUID().v4();
    Connections.push(new Connection(uuid, ws));
    Logging.logMessage(`${uuid} | Connection established.`);

    // Messages
    ws.on("message", data => {
        try {
            // to-do
        } catch (e) {
            Logging.logMessage(`${uuid} | Error while receiving message: ${e.message}`);
        }
    });

    // Disconnections.
    ws.on("close", () => {
        Logging.logMessage(`${uuid}: disconnected.`);
        const index = Connections.findIndex(c => c.uuid === uuid);
        if(index > -1) {
            Connections.splice(index, 1);
        }
    });
});