# AI-Powered Customer Support System

This is a fullstack multi-agent customer support system built with Hono.dev, React, and Prisma.

## Setup

1.  **Clone the repository.**
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Environment Variables:**
    Create a `.env` file in `apps/api` (using `apps/api/env.example` as a template).
    You MUST provide a `GOOGLE_GENERATIVE_AI_API_KEY`.

## Deployment

### Backend (Render)
1.  **Connect your GitHub repo** to Render.
2.  Choose **Web Service**.
3.  **Root Directory**: `apps/api`
4.  **Build Command**: `npm install && npm run build && npm run db:setup`
5.  **Start Command**: `npm start`
6.  **Environment Variables**:
    - `GOOGLE_GENERATIVE_AI_API_KEY`: Your Gemini Key.
    - `DATABASE_URL`: `file:./dev.db` (Note: SQLite won't persist on Free tier restarts).
    - `PORT`: `3000`

### Frontend (Vercel)
1.  **Connect your GitHub repo** to Vercel.
2.  **Root Directory**: `apps/web`
3.  **Framework Preset**: `Vite`
4.  **Configuration**: Update `apps/web/vercel.json` with your actual Render API URL.
5.  **Build Command**: `npm run build`
6.  **Environment Variables**: None (it proxies `/api` via `vercel.json`).
4.  **Database Setup:**
    The project uses SQLite for simplicity. Run the following in `apps/api`:
    ```bash
    npx prisma db push
    npx prisma db seed
    ```
5.  **Run the application:**
    Run this from the root:
    ```bash
    npm run dev
    ```
    This will start:
    - Backend: http://localhost:3000
    - Frontend: http://localhost:5173

## Features

- **Router Agent**: Automatically classifies user intent.
- **Specialized Agents**: Support, Orders, and Billing agents handler specific queries.
- **Tool Calling**: Agents can query the database for order status, invoices, and FAQs.
- **Streaming**: AI responses are streamed in real-time.
- **Conversational Context**: Maintains history across messages.
- **Premium UI**: Dark mode, glassmorphism, and smooth animations using Framer Motion.
- **Monorepo + Hono RPC**: Type safety across backend and frontend.

## Notice

- **FEEL FREE TO ALTER THE MODEL, CURRENTLY USING GEMINI-2.0-FLASH**
