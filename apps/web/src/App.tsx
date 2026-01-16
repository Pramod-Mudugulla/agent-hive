import React, { useState, useEffect, useRef } from 'react'
import { MessageSquare, Settings, Trash2, Send, Plus, Bot, User } from 'lucide-react'
import { useChat } from 'ai/react'
import { motion, AnimatePresence } from 'framer-motion'
import { hc } from 'hono/client'
import type { AppType } from '../../api/src/index'

const client = hc<AppType>('/')

export default function App() {
    const [conversations, setConversations] = useState<any[]>([])
    const [currentId, setCurrentId] = useState<string | null>(null)

    const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages, append } = useChat({
        api: '/api/chat/messages',
        body: { conversationId: currentId },
        onResponse: (response) => {
            const newId = response.headers.get('x-conversation-id')
            if (newId && newId !== currentId) {
                setCurrentId(newId)
                fetchConversations()
            }
        }
    })

    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        fetchConversations()
    }, [])

    const fetchConversations = async () => {
        const res = await fetch('/api/chat/conversations')
        const data = await res.json()
        setConversations(data)
    }

    const loadConversation = async (id: string) => {
        setCurrentId(id)
        const res = await fetch(`/api/chat/conversations/${id}/messages`)
        const data = await res.json()
        setMessages(data.map((m: any) => ({
            ...m,
            role: m.role.toLowerCase()
        })))
    }

    const startNewChat = () => {
        setCurrentId(null)
        setMessages([])
    }

    const deleteConversation = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        await fetch(`/api/chat/conversations/${id}`, { method: 'DELETE' })
        if (currentId === id) startNewChat()
        fetchConversations()
    }

    return (
        <div className="chat-container-root" style={{ display: 'flex', width: '100%', height: '100vh', backgroundColor: 'var(--bg-color)' }}>
            {/* Sidebar */}
            <div className="sidebar">
                <div className="sidebar-header">
                    <button onClick={startNewChat} className="new-chat-btn">
                        <Plus size={18} /> New Chat
                    </button>
                </div>
                <div className="sidebar-content">
                    {conversations.map((conv) => (
                        <div
                            key={conv.id}
                            className={`conversation-item ${currentId === conv.id ? 'active' : ''}`}
                            onClick={() => loadConversation(conv.id)}
                        >
                            <MessageSquare size={16} />
                            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {conv.id.substring(0, 12)}...
                            </span>
                            <Trash2 size={14} className="delete-icon" onClick={(e) => deleteConversation(conv.id, e)} style={{ cursor: 'pointer', opacity: 0.5 }} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="chat-container">
                {/* Top Nav */}
                <div className="top-nav">
                    <div className="logo">SWADES AI</div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Settings size={20} style={{ cursor: 'pointer', opacity: 0.6 }} />
                    </div>
                </div>

                <div className="messages-list">
                    <AnimatePresence>
                        {messages.length === 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--muted-text)', textAlign: 'center' }}>
                                <Bot size={64} strokeWidth={1} style={{ marginBottom: '2rem', opacity: 0.2 }} />
                                <h1 style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '1rem', color: 'var(--text-color)' }}>MOVE FORWARD.</h1>
                                <p style={{ fontSize: '1.1rem', fontWeight: 400, opacity: 0.6 }}>Our AI is here to help you with orders, billing, and more.</p>
                            </div>
                        )}
                        {messages.map((m) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={m.id}
                                className={`message-wrapper ${m.role === 'user' ? 'user' : ''}`}
                            >
                                <div className={`message ${m.role === 'user' ? 'user' : 'assistant'}`}>
                                    {m.content}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {isLoading && (
                        <div className="message-wrapper">
                            <div className="message assistant">
                                <div className="typing-indicator">
                                    <div className="typing-dot"></div>
                                    <div className="typing-dot"></div>
                                    <div className="typing-dot"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="input-area">
                    <form onSubmit={handleSubmit} className="input-container">
                        <input
                            value={input}
                            onChange={handleInputChange}
                            placeholder="Message Swades AI..."
                            disabled={isLoading}
                        />
                        <button type="submit" className="send-btn" disabled={isLoading || !input.trim()}>
                            <Send size={20} />
                        </button>
                    </form>
                    <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--muted-text)', marginTop: '1.5rem', fontWeight: 400 }}>
                        Swades AI can make mistakes. Check important info.
                    </p>
                </div>
            </div>
        </div>
    )
}
