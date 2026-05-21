package com.chatapp.backend.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class AiSuggestionService {

    @Value("${anthropic.api.key}")
    private String apiKey;

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public AiSuggestionService(ObjectMapper objectMapper) {
        this.restClient = RestClient.builder()
                .baseUrl("https://api.anthropic.com")
                .build();
        this.objectMapper = objectMapper;
    }

    public List<String> getSuggestions(String lastMessage, String context) {
        try {
            String prompt = String.format("""
                You are a helpful chat assistant. Based on this message:
                "%s"
                
                Generate exactly 3 short reply suggestions.
                Respond with ONLY a JSON array of 3 strings, nothing else.
                Example: ["Sure!", "I'll think about it", "Not right now"]
                
                Context: %s
                """, lastMessage, context);

            Map<String, Object> requestBody = Map.of(
                "model", "claude-sonnet-4-5",
                "max_tokens", 200,
                "messages", List.of(
                    Map.of("role", "user", "content", prompt)
                )
            );

            String response = restClient.post()
                    .uri("/v1/messages")
                    .header("x-api-key", apiKey)
                    .header("anthropic-version", "2023-06-01")
                    .header("Content-Type", "application/json")
                    .body(requestBody)
                    .retrieve()
                    .body(String.class);

            var responseMap = objectMapper.readValue(response, Map.class);
            var content = (List<Map<String, Object>>) responseMap.get("content");
            String text = (String) content.get(0).get("text");

            text = text.trim();
            if (text.startsWith("```")) {
                text = text.replaceAll("```json\\n?", "").replaceAll("```", "").trim();
            }

            return objectMapper.readValue(text, List.class);

        } catch (Exception e) {
    System.err.println("AI suggestion error: " + e.getMessage());
    e.printStackTrace();
    return List.of("Sure!", "Let me think about it", "Tell me more");
}
    }
}