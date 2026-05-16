package com.chatapp.backend.repository;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.chatapp.backend.entity.User;

public interface UserRepository extends JpaRepository<User, UUID> {
    // Spring generates: SELECT * FROM users WHERE email = ?
    Optional<User> findByEmail(String email);
    
    // Spring generates: SELECT * FROM users WHERE username = ?
    Optional<User> findByUsername(String username);
}