module.exports = class Message {
    uuid;
    sender;
    receiver;
    contentType;
    content;
    constructor(uuid, sender, receiver, contentType, content) {
        this.uuid = uuid;
        this.sender = sender;
        this.receiver = receiver;
        this.contentType = contentType;
        this.content = content;
    }
}