package com.chatapp.backend.dto;

import java.util.UUID;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ChatRoomResponse {
    private UUID id;
    private String name;
    private String createdBy;
    private LocalDateTime createdAt;

}