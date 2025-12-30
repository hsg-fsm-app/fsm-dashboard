# Customer Chat System

A simple real-time chat system for admin-customer communication, built with React, Netlify Functions, and Supabase.

## How It Works

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│  Admin Dashboard │ ──────▶ │ Netlify Functions │ ──────▶ │    Supabase     │
│  (ChatDashboard) │ ◀────── │  (chat-session)   │ ◀────── │   (Postgres)    │
└─────────────────┘         │  (chat-message)   │         └─────────────────┘
                            └──────────────────┘                  │
                                    ▲                             │
                                    │                    Realtime │
┌─────────────────┐                 │                  WebSocket  │
│ Customer Portal │ ────────────────┘                             │
│   (future)      │ ◀─────────────────────────────────────────────┘
└─────────────────┘
```

## End-to-End Flow

### 1. Admin Creates Chat Session
- Admin clicks "New Chat" in the dashboard
- Enters customer name/email
- System creates `chat_sessions` row in Supabase
- Returns a shareable link: `https://yoursite.com/chat?chatId=<uuid>`

### 2. Admin Shares Link
- Copy the generated link
- Send to customer via email, SMS, or any channel

### 3. Customer Opens Link (Future)
- Customer clicks link → opens chat portal
- No login required, identified by session ID
- Can send messages immediately

### 4. Real-time Messaging
- Both parties send messages via `chat-message` function
- Messages stored in `chat_messages` table
- Supabase Realtime broadcasts new messages instantly
- UI updates without refresh

### 5. Session Management
- Admin can view all sessions in sidebar
- Filter by open/closed status
- Close sessions when conversation ends

## File Structure

```
src/
├── pages/
│   └── ChatDashboard.tsx      # Admin chat interface
├── styles/pages/
│   └── ChatDashboard.css      # Chat styling
└── netlify/functions/
    ├── chat-session.ts        # Session CRUD (create, list, close)
    ├── chat-message.ts        # Message CRUD (send, fetch)
    └── lib/supabase.ts        # Supabase client
```

## Database Schema

```sql
-- Chat sessions (one per customer conversation)
create table chat_sessions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  status text default 'open',      -- 'open' or 'closed'
  customer_name text,
  customer_email text,
  metadata jsonb
);

-- Chat messages (many per session)
create table chat_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  chat_id uuid references chat_sessions(id),
  sender_type text,                -- 'admin' or 'customer'
  sender_id text,
  content text
);

-- Enable realtime for live updates
alter publication supabase_realtime add table chat_messages;
```

## API Endpoints

### Sessions (`/.netlify/functions/chat-session`)

| Method | Query Params | Body | Description |
|--------|--------------|------|-------------|
| GET | - | - | List all sessions |
| GET | `?id=<uuid>` | - | Get single session |
| POST | - | `{ customer_name, customer_email }` | Create session |
| DELETE | `?id=<uuid>` | - | Close session |

### Messages (`/.netlify/functions/chat-message`)

| Method | Query Params | Body | Description |
|--------|--------------|------|-------------|
| GET | `?chatId=<uuid>` | - | Get messages for session |
| POST | - | `{ chat_id, sender_type, content }` | Send message |

## Environment Variables

```bash
# Server-side (Netlify Functions)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Client-side (Vite/React)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Running Locally

```bash
# Must use netlify dev (not npm run dev)
netlify dev

# Access via port 8888 (NOT 5173)
open http://localhost:8888
```

## Future Enhancements

- [ ] Customer-facing portal page
- [ ] Typing indicators
- [ ] Read receipts
- [ ] File attachments
- [ ] Push notifications
- [ ] Chat transcripts/export
- [ ] Multiple admin support
