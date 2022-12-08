module.exports = class Message {
    uuid;
    sender;
    receiver;
    constructor(uuid, sender, receiver) {
        this.uuid = uuid;
        this.sender = sender;
        this.receiver = receiver;
    }
}