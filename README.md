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
    You MUST provide an `OPENAI_API_KEY`.
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
