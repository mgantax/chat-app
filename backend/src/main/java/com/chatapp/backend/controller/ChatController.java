package com.chatapp.backend.controller;

import com.chatapp.backend.dto.MessageRequest;
import com.chatapp.backend.dto.MessageResponse;
import com.chatapp.backend.entity.Message;
import com.chatapp.backend.entity.User;
import com.chatapp.backend.repository.ChatRoomRepository;
import com.chatapp.backend.repository.MessageRepository;
import com.chatapp.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final MessageRepository messageRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final UserRepository userRepository;

    @MessageMapping("/chat/{roomId}")
    public void sendMessage(@Payload MessageRequest request,
                            Authentication authentication) {
        String username = authentication.getName();

        User sender = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        var room = chatRoomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        Message message = new Message();
        message.setContent(request.getContent());
        message.setSender(sender);
        message.setChatRoom(room);

        Message saved = messageRepository.save(message);

        MessageResponse response = new MessageResponse(
                saved.getId(),
                saved.getContent(),
                saved.getSender().getUsername(),
                saved.getCreatedAt()
        );

        messagingTemplate.convertAndSend(
                "/topic/rooms/" + request.getRoomId(),
                response
        );
    }
}