package com.chatapp.backend.service;



import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import com.chatapp.backend.dto.MessageResponse;
import com.chatapp.backend.repository.ChatRoomRepository;
import com.chatapp.backend.repository.MessageRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final ChatRoomRepository chatRoomRepository;

    public Page<MessageResponse> getMessages(UUID roomId, int page, int size) {
       var room = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found")); 
        var pageable = org.springframework.data.domain.PageRequest.of(page, size);
        return messageRepository.findByChatRoomOrderByCreatedAtAsc(room, pageable)
                .map(msg -> new MessageResponse(
                        msg.getId(),
                        msg.getContent(),
                        msg.getSender().getUsername(),
                        msg.getCreatedAt()
                ));
    }
}