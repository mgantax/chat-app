CREATE TABLE user_chatrooms (
    user_id UUID NOT NULL REFERENCES users(id),
    chatroom_id UUID NOT NULL  REFERENCES chat_rooms(id),
    PRIMARY KEY (user_id, chatroom_id)
);