package com.chatapp.backend.dto;

import java.util.UUID;

import lombok.Data;

@Data
public class MessageRequest {
    private UUID roomId;
    private String content;
   
}