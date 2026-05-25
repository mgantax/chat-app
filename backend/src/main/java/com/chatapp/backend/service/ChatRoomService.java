package com.chatapp.backend.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.chatapp.backend.dto.ChatRoomRequest;
import com.chatapp.backend.dto.ChatRoomResponse;
import com.chatapp.backend.entity.ChatRoom;
import com.chatapp.backend.entity.User;
import com.chatapp.backend.repository.ChatRoomRepository;
import com.chatapp.backend.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;
    private final UserRepository userRepository;

    public List<ChatRoomResponse> getRoomsForCurrentUser() {
        String username = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return chatRoomRepository.findByParticipants_Id(user.getId())
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ChatRoomResponse createRoom(ChatRoomRequest request) {
        String username = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ChatRoom room = new ChatRoom();
        room.setName(request.getName());
        room.setCreatedBy(user);
        room.getParticipants().add(user);

        ChatRoom saved = chatRoomRepository.save(room);
        return toResponse(saved);
    }

    @Transactional
    public List<ChatRoomResponse> getAllRooms() {
    return chatRoomRepository.findAll()
            .stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
}

   @Transactional
    public ChatRoomResponse joinRoom(UUID roomId) {
        String username = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        ChatRoom room = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        room.getParticipants().add(user);
        ChatRoom saved = chatRoomRepository.save(room);
        return toResponse(saved);
    }

    private ChatRoomResponse toResponse(ChatRoom room) {
        return new ChatRoomResponse(
                room.getId(),
                room.getName(),
                room.getCreatedBy().getUsername(),
                room.getCreatedAt()
        );
    }
}