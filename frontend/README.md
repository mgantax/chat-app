# ChatApp — Real-time Messaging with AI Suggestions

A production-ready real-time chat application where teammates, friends, or communities can message each other instantly — with Claude AI suggesting smart replies as you chat.

---

## What it does

ChatApp lets you create chat rooms, invite others, and exchange messages in real time. When you receive a message and aren't sure how to respond, click **"Suggest reply"** and Claude AI generates three contextually relevant options. Pick one, edit it, or ignore it — the choice is yours.

---

## When to use it

| Scenario | Why ChatApp fits |
|---|---|
| **Small team communication** | Create rooms per project or topic, keep conversations focused |
| **Remote study groups** | Real-time discussion without switching to heavy tools like Slack |
| **Community chat** | Anyone can join a room with a single link |
| **Learning project** | A working full-stack app to study and extend |
| **AI-assisted communication** | Useful when chatting in a second language or under time pressure |

---

## Features

- **Real-time messaging** — messages appear instantly across all connected browsers, no refresh needed
- **Chat rooms** — create rooms for different topics or teams; join existing ones
- **AI reply suggestions** — Claude AI suggests three replies based on the message you received
- **Secure authentication** — JWT-based login and registration; passwords are hashed with BCrypt
- **Message history** — scroll back through past conversations with paginated loading
- **Online presence** — see who connects and disconnects in real time
- **Rate limiting** — AI suggestions are limited to 5 per user per minute to prevent abuse

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Backend | Java 21 + Spring Boot 3 |
| Real-time | WebSocket + STOMP |
| Database | PostgreSQL 16 |
| Auth | Spring Security + JWT |
| AI | Anthropic Claude API |
| Migrations | Flyway |
| Deployment | Docker + Railway |

---

## Live demo

Frontend: `https://chat-app-frontend-production-0e92.up.railway.app`

Register an account, create a room, open a second browser window with a different account, join the same room, and watch messages appear in real time.

---

## Running locally

### Prerequisites

- Java 21
- Node.js 20+
- Docker Desktop

### 1. Clone the repo

```bash
git clone https://github.com/mgantax/chat-app.git
cd chat-app
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in:

```
DB_NAME=chatapp
DB_USER=chatapp_user
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=your_secret_key_at_least_32_chars
JWT_EXPIRATION=86400000
ANTHROPIC_API_KEY=your_claude_api_key
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/chatapp
SPRING_DATASOURCE_USERNAME=chatapp_user
SPRING_DATASOURCE_PASSWORD=your_password
```

Get a Claude API key at [console.anthropic.com](https://console.anthropic.com).

### 3. Start with Docker Compose

```bash
docker compose up --build
```

This starts PostgreSQL, the Spring Boot backend, and the React frontend together.

Open `http://localhost` in your browser.

### 4. Running in development mode

**Backend:**
```bash
cd backend
export $(grep -v '^#' ../.env | xargs) && ./mvnw spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`, backend at `http://localhost:8080`.

---

## API overview

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Create account | No |
| POST | `/api/auth/login` | Login, get JWT | No |
| GET | `/api/rooms` | List your rooms | Yes |
| POST | `/api/rooms` | Create a room | Yes |
| POST | `/api/rooms/{id}/join` | Join a room | Yes |
| GET | `/api/rooms/{id}/messages` | Message history | Yes |
| POST | `/api/suggestions` | Get AI reply suggestions | Yes |
| WS | `/ws` | WebSocket endpoint (STOMP) | Yes |

---

## Project structure

```
chat-app/
├── backend/                  # Spring Boot app
│   └── src/main/java/com/chatapp/backend/
│       ├── config/           # Security, WebSocket config
│       ├── controller/       # REST + WebSocket controllers
│       ├── dto/              # Request/response objects
│       ├── entity/           # JPA entities
│       ├── exception/        # Global error handling
│       ├── repository/       # Spring Data JPA repos
│       └── service/          # Business logic + AI service
├── frontend/                 # React app
│   └── src/
│       ├── components/       # MessageList, MessageInput, SuggestionChips
│       ├── context/          # Auth context
│       ├── hooks/            # useWebSocket
│       └── pages/            # LoginPage, RoomsPage, ChatPage
├── docker-compose.yml        # Full local stack
├── .env.example              # Environment variable template
└── README.md
```

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push and open a pull request

---

## License

MIT
