package com.chatapp.backend.controller;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class PresenceController {

    private final SimpMessagingTemplate messagingTemplate;

    private final Map<String, String> sessionToUser = new ConcurrentHashMap<>();

    @EventListener
    public void handleConnect(SessionConnectedEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String username = accessor.getUser() != null ?
                accessor.getUser().getName() : "anonymous";
        String sessionId = accessor.getSessionId();
        sessionToUser.put(sessionId, username);

        messagingTemplate.convertAndSend("/topic/presence", 
                Map.of("user", username, "status", "ONLINE"));
    }

    @EventListener
    public void handleDisconnect(SessionDisconnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = accessor.getSessionId();
        String username = sessionToUser.remove(sessionId);

        if (username != null) {
            messagingTemplate.convertAndSend("/topic/presence",
                    Map.of("user", username, "status", "OFFLINE"));
        }
    }
}