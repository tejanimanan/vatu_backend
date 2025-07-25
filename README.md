# MyInsta Backend

This is a simple Express.js backend for the MyInsta app. It uses in-memory data for demo purposes.

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Start the server:
   ```
   npm run dev
   ```
   The server will run on http://localhost:5000

## API Endpoints

- **Auth**
  - `POST /api/auth/login` — Login (body: `{ username, password }`)
  - `POST /api/auth/register` — Register (body: `{ username, password, name }`)

- **Users**
  - `GET /api/users/me` — Get current user
  - `PUT /api/users/me` — Update current user
  - `GET /api/users` — List all users

- **Posts**
  - `GET /api/posts` — List all posts
  - `POST /api/posts` — Create a new post

- **Stories**
  - `GET /api/stories` — List all stories

- **Reels**
  - `GET /api/reels` — List all reels

- **Conversations**
  - `GET /api/conversations` — List all conversations
  - `POST /api/conversations/:id/messages` — Add message to conversation

- **Notifications**
  - `GET /api/notifications` — List notifications

---

> This backend is for demo/dev only. All data is in-memory and resets on server restart. #   v a t u _ b a c k e n d  
 