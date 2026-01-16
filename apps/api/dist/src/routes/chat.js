import { Hono } from 'hono';
import { routeQuery } from '../agents';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const chat = new Hono();
chat.post('/messages', async (c) => {
    const { content, conversationId } = await c.req.json();
    // 1. Get or create conversation
    let conversation;
    if (conversationId) {
        conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
            include: { messages: { orderBy: { createdAt: 'asc' } } }
        });
    }
    if (!conversation) {
        conversation = await prisma.conversation.create({
            data: { agentType: 'ROUTER' },
            include: { messages: true }
        });
    }
    // 2. Persist user message
    await prisma.message.create({
        data: {
            content,
            role: 'USER',
            conversationId: conversation.id
        }
    });
    // 3. Prepare history for AI
    const history = conversation.messages.map(m => ({
        role: m.role.toLowerCase(),
        content: m.content
    }));
    // 4. Stream response from agents
    const result = await routeQuery(content, history);
    // Return a streaming response
    return result.toDataStreamResponse({
        headers: {
            'x-conversation-id': conversation.id
        },
        async onFinish({ text }) {
            // Persist AI message on finish
            await prisma.message.create({
                data: {
                    content: text,
                    role: 'ASSISTANT',
                    conversationId: conversation.id
                }
            });
        }
    });
});
chat.get('/conversations', async (c) => {
    const conversations = await prisma.conversation.findMany({
        orderBy: { updatedAt: 'desc' }
    });
    return c.json(conversations);
});
chat.get('/conversations/:id/messages', async (c) => {
    const id = c.req.param('id');
    const messages = await prisma.message.findMany({
        where: { conversationId: id },
        orderBy: { createdAt: 'asc' }
    });
    return c.json(messages);
});
chat.delete('/conversations/:id', async (c) => {
    const id = c.req.param('id');
    await prisma.conversation.delete({ where: { id } });
    return c.json({ success: true });
});
export { chat };
