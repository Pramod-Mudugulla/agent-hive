import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { chat } from './routes/chat';
const app = new Hono().basePath('/api');
app.use('/*', cors());
app.route('/chat', chat);
app.get('/agents', (c) => {
    return c.json([
        { type: 'SUPPORT', capabilities: ['FAQ', 'Knowledge Base'] },
        { type: 'ORDERS', capabilities: ['Tracking', 'Cancellations'] },
        { type: 'BILLING', capabilities: ['Invoices', 'Refunds'] }
    ]);
});
app.get('/health', (c) => {
    return c.json({ status: 'ok' });
});
const port = Number(process.env.PORT) || 3000;
console.log(`Server is running on http://localhost:${port}`);
serve({
    fetch: app.fetch,
    port
});
