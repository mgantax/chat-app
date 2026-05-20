import { useEffect, useRef, useCallback } from "react";
import { Client, type IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface UseWebSocketProps {
  roomId: string;
  token: string;
  onMessage: (message: unknown) => void;
}

export function useWebSocket({ roomId, token, onMessage }: UseWebSocketProps) {
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      onConnect: () => {
        console.log("WebSocket connected");
        client.subscribe(`/topic/rooms/${roomId}`, (message: IMessage) => {
          const body = JSON.parse(message.body);
          onMessage(body);
        });
      },
      onDisconnect: () => {
        console.log("WebSocket disconnected");
      },
      onStompError: (frame) => {
        console.error("STOMP error", frame);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [roomId, token]);

  const sendMessage = useCallback(
    (content: string) => {
      if (clientRef.current?.connected) {
        clientRef.current.publish({
          destination: `/app/chat/${roomId}`,
          body: JSON.stringify({ roomId, content }),
        });
      }
    },
    [roomId]
  );

  return { sendMessage };
}