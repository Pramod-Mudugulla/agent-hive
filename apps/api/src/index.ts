import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { chat } from './routes/chat'

const app = new Hono()

app.use('/*', cors())

app.get('/', (c) => {
    return c.html(`
    <html>
      <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #0f172a; color: white;">
        <div style="text-align: center;">
          <h1>Swades AI Support API</h1>
          <p>The API is running at <a href="/api/health" style="color: #3b82f6;">/api</a></p>
          <p>Frontend should be running at <a href="http://localhost:5173" style="color: #3b82f6;">http://localhost:5173</a></p>
        </div>
      </body>
    </html>
  `)
})

const api = app.basePath('/api')

api.route('/chat', chat)

api.get('/agents', (c) => {
    return c.json([
        { type: 'SUPPORT', capabilities: ['FAQ', 'Knowledge Base'] },
        { type: 'ORDERS', capabilities: ['Tracking', 'Cancellations'] },
        { type: 'BILLING', capabilities: ['Invoices', 'Refunds'] }
    ])
})

api.get('/health', (c) => {
    return c.json({ status: 'ok' })
})

const port = Number(process.env.PORT) || 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
    fetch: app.fetch,
    port
})

export type AppType = typeof app
