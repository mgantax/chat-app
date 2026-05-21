import React from "react";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
}

export default function MessageInput({ value, onChange, onSend }: MessageInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div style={{ display: "flex", padding: "16px", gap: "8px", borderTop: "1px solid #eee" }}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type a message..."
        style={{ flex: 1, padding: "8px 12px", borderRadius: "20px",
          border: "1px solid #ddd", outline: "none" }}
      />
      <button
        onClick={onSend}
        style={{ padding: "8px 16px", background: "#007bff", color: "white",
          border: "none", borderRadius: "20px", cursor: "pointer" }}>
        Send
      </button>
    </div>
  );
}