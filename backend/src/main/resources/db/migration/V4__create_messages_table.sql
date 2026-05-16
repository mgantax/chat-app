CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content VARCHAR(500) NOT NULL,
    sender_id UUID NOT NULL REFERENCES users(id),
    chatroom_id UUID NOT NULL REFERENCES chat_rooms(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);