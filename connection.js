module.exports = class Connection {
    uuid;
    ws;
    constructor(uuid, ws) {
        this.uuid = uuid;
        this.ws = ws;
    }
}