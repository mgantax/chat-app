package com.chatapp.backend.repository;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.chatapp.backend.entity.ChatRoom;
import com.chatapp.backend.entity.Message;

public interface MessageRepository extends JpaRepository<Message, UUID> {

    Page<Message> findByChatRoomOrderByCreatedAtAsc(ChatRoom chatRoom, Pageable pageable);
}