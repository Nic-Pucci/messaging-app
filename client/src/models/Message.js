class Message {
    constructor(conversationID, authorID, authorUserName, messageText, timeStamp) {
        this.conversationID = conversationID;
        this.authorID = authorID;
        this.authorUserName = authorUserName;
        this.messageText = messageText;
        this.timeStamp = timeStamp;
    }
}

export default Message;