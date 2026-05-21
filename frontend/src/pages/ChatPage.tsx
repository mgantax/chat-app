import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWebSocket } from "../hooks/useWebSocket";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import SuggestionChips from "../components/SuggestionChips";

export default function ChatPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const { token, username } = useAuth();
  const [messages, setMessages] = useState<unknown[]>([]);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const { sendMessage } = useWebSocket({
    roomId: roomId!,
    token: token!,
    onMessage: (message) => {
      setMessages((prev) => [...prev, message]);
    },
  });

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `/api/rooms/${roomId}/messages?page=0&size=50`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setMessages(data.content);
      } catch (error) {
        console.error("Failed to fetch messages", error);
      }
    };

    if (roomId) {
      fetchMessages();
    }
  }, [roomId]);

  const handleSuggest = async (messageContent: string) => {
    try {
      const response = await fetch("/api/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          lastMessage: messageContent,
          context: messages.map((m) => m.content).join("\n"),
        }),
      });
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Failed to fetch suggestions", error);
    }
  };

  const handleSend = () => {
    if (input.trim() !== "") {
      sendMessage(input);
      setInput("");
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setInput(suggestion);
    setSuggestions([]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #eee",
        fontWeight: "bold", fontSize: "16px" }}>
        Chat Room
      </div>
      <MessageList
        messages={messages}
        currentUsername={username!}
        onSuggest={handleSuggest}
      />
      {suggestions.length > 0 && (
        <div style={{ padding: "8px 16px" }}>
          <SuggestionChips
            suggestions={suggestions}
            onSelect={handleSelectSuggestion}
          />
        </div>
      )}
      <MessageInput
        value={input}
        onChange={setInput}
        onSend={handleSend}
      />
    </div>
  );
}