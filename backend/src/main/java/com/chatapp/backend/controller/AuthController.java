package com.chatapp.backend.controller;

import com.chatapp.backend.dto.AuthRequest;
import com.chatapp.backend.dto.AuthResponse;
import com.chatapp.backend.dto.RegisterRequest;
import com.chatapp.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(
            new AuthRequest(request.getUsername(), request.getPassword()),
            request.getFirstName(),
            request.getLastName(),
            request.getEmail()
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}