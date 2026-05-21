package com.chatapp.backend.dto;

import lombok.Data;

@Data
public class SuggestionRequest {
    private String lastMessage;
    private String context;
   
}