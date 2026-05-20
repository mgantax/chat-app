package com.chatapp.backend.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MessageResponse {
    private UUID id;
    private String content;
    private String senderUsername;
    private LocalDateTime createdAt;
}