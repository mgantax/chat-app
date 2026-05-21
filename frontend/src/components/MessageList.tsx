interface Message {
  id: string;
  content: string;
  senderUsername: string;
  createdAt: string;
}

interface MessageListProps {
  messages: Message[];
  currentUsername: string;
  onSuggest: (message: string) => void;
}

export default function MessageList({ messages, currentUsername, onSuggest }: MessageListProps) {
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
      {messages.map((msg) => (
        <div key={msg.id} style={{
          display: "flex",
          flexDirection: "column",
          alignItems: msg.senderUsername === currentUsername ? "flex-end" : "flex-start",
          marginBottom: "12px"
        }}>
          <div style={{ fontSize: "12px", color: "#888", marginBottom: "4px" }}>
            {msg.senderUsername}
          </div>
          <div style={{
            background: msg.senderUsername === currentUsername ? "#007bff" : "#f0f0f0",
            color: msg.senderUsername === currentUsername ? "white" : "black",
            padding: "8px 12px",
            borderRadius: "12px",
            maxWidth: "70%"
          }}>
            {msg.content}
          </div>
          {msg.senderUsername !== currentUsername && (
            <button
              onClick={() => onSuggest(msg.content)}
              style={{ fontSize: "11px", color: "#888", background: "none",
                border: "none", cursor: "pointer", marginTop: "4px" }}>
              Suggest reply
            </button>
          )}
        </div>
      ))}
    </div>
  );
}