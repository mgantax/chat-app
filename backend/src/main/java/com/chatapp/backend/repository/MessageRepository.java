package com.chatapp.backend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.chatapp.backend.entity.ChatRoom;
import com.chatapp.backend.entity.Message;

public interface MessageRepository extends JpaRepository<Message, UUID> {

    List<Message> findByChatRoomOrderByCreatedAtAsc(ChatRoom chatRoomId);
}