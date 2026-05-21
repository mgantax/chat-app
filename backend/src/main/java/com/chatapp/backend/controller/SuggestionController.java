package com.chatapp.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.chatapp.backend.dto.SuggestionRequest;
import com.chatapp.backend.service.AiSuggestionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/suggestions")
@RequiredArgsConstructor
public class SuggestionController {

    private final AiSuggestionService aiSuggestionService;

    @PostMapping
    public ResponseEntity<List<String>> getSuggestions(
            @RequestBody SuggestionRequest request) {
        return ResponseEntity.ok(
            aiSuggestionService.getSuggestions(
                request.getLastMessage(),
                request.getContext()
            )
        );
    }
}