package myShop.chat;

public class ChatMessage<T> {

    private String content;
    private String sender;

    public ChatMessage() {
    }

    public ChatMessage(String content, String sender) {
        this.setContent(content);
        this.setSender(sender);
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }
}
