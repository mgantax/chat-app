package com.chatapp.backend.controller;

import com.chatapp.backend.dto.SuggestionRequest;
import com.chatapp.backend.service.AiSuggestionService;
import com.chatapp.backend.service.RateLimiterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/suggestions")
@RequiredArgsConstructor
public class SuggestionController {

    private final AiSuggestionService aiSuggestionService;
    private final RateLimiterService rateLimiterService;

    @PostMapping
    public ResponseEntity<List<String>> getSuggestions(
            @RequestBody SuggestionRequest request,
            Authentication authentication) {

        String username = authentication.getName();

        if (!rateLimiterService.tryConsume(username)) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(List.of("Too many requests — please wait a moment"));
        }

        return ResponseEntity.ok(
            aiSuggestionService.getSuggestions(
                request.getLastMessage(),
                request.getContext()
            )
        );
    }
}