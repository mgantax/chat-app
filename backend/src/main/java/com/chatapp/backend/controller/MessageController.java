package com.chatapp.backend.controller;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.chatapp.backend.dto.MessageResponse;
import com.chatapp.backend.service.MessageService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/rooms/{roomId}/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @GetMapping
    public ResponseEntity<Page<MessageResponse>> getMessages(
        @PathVariable UUID roomId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size) {
    return ResponseEntity.ok(messageService.getMessages(roomId, page, size));
}
}