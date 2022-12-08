const Logging = require("./logging");
const Connection = require("./connection");
const UUID = require('uuid');
const Message = require("./message");
const WebSocket = require("ws");

const wss = new WebSocket.WebSocketServer({port: 8080});

const Connections = [];
const Messages = [];
wss.on("connection", ws => {

    // Accepting connection.
    Logging.logMessage("Establishing new connection...");
    const index = Connections.findIndex(c => c.ws === ws);
    if(index > -1) {
        Connections.splice(index, 1);
    }
    const uuid = UUID.v4();
    Connections.push(new Connection(uuid, ws));
    Logging.logMessage(`${uuid} | Connection established.`);

    // Messages
    ws.on("message", data => {
        try {
            Logging.logMessage(`${uuid} | Received data.`);
            const message = JSON.parse(data);

            // Sending Message
            if(message["header"]["type"] === "SendMessage") {
                const messageUuid = UUID.v4();
                const receiver = message["header"]["receiver"];
                const contentType = message["header"]["contentType"];
                const content = message["content"];
                Messages.push(new Message(messageUuid, uuid, receiver, contentType, content));
                const index = Connections.findIndex(c => c.uuid === receiver);
                if(index > -1) {
                    Logging.logMessage(`${uuid} | Transfering message (${messageUuid}) to ${receiver}.`);
                    Connections[index].ws.send(JSON.stringify({
                        header: {
                            type: "ReceiveMessage"
                        },
                        message: messageUuid
                    }));
                }
            }

            // Receiving Message
            if(message["header"]["type"] === "ReceiveMessage") {
                const messageUuid = message["message"];
                const index = Messages.findIndex(m => m.uuid === messageUuid);
                if(index > -1) {
                    Logging.logMessage(`${uuid} | Received message (${messageUuid}) from ${Messages[index].sender}.`);
                    delete Messages[index].receiver;
                    ws.send(JSON.stringify(Messages[index]));
                }
            }
        } catch (e) {
            Logging.logMessage(`${uuid} | Error while receiving message: ${e.message}`);
        }
    });

    // Disconnections.
    ws.on("close", () => {
        Logging.logMessage(`${uuid} | disconnected.`);
        const index = Connections.findIndex(c => c.uuid === uuid);
        if(index > -1) {
            Connections.splice(index, 1);
        }
    });
});