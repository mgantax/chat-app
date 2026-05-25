package com.chatapp.backend.controller;

import java.util.List;

import com.chatapp.backend.dto.ChatRoomRequest;
import com.chatapp.backend.dto.ChatRoomResponse;

import java.util.UUID;

import com.chatapp.backend.service.ChatRoomService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class ChatRoomController {

    private final ChatRoomService chatRoomService;

    @GetMapping
    public ResponseEntity<List<ChatRoomResponse>> getRooms() {
        return ResponseEntity.ok(chatRoomService.getRoomsForCurrentUser());

    } 
    @PostMapping
    public ResponseEntity<ChatRoomResponse> createRoom(@RequestBody ChatRoomRequest request) {
        return ResponseEntity.status(201).body(chatRoomService.createRoom(request));
    }

    @PostMapping("/{roomId}/join")
    public ResponseEntity<ChatRoomResponse> joinRoom(@PathVariable UUID roomId) {
        return ResponseEntity.ok(chatRoomService.joinRoom(roomId));
    }

    @GetMapping("/all")
public ResponseEntity<List<ChatRoomResponse>> getAllRooms() {
    return ResponseEntity.ok(chatRoomService.getAllRooms());
}
}