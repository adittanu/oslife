import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';

function getCsrfToken() {
    const meta = document.querySelector('meta[name="csrf-token"]');
    if (meta) return meta.content;
    // Fallback: read from XSRF-TOKEN cookie
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

function MarkdownText({ content }) {
    const html = content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
        .replace(/\n/g, '<br/>');
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [conversationId, setConversationId] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    useEffect(() => {
        if (open && inputRef.current) {
            inputRef.current.focus();
        }
    }, [open]);

    const loadConversations = async () => {
        try {
            const res = await axios.get('/api/chat/conversations');
            setConversations(res.data);
            setShowHistory(true);
        } catch (e) {
            // ignore
        }
    };

    const loadConversation = async (convId) => {
        try {
            const res = await axios.get(`/api/chat/${convId}/messages`);
            setMessages(res.data.map(m => ({ role: m.role, content: m.content })));
            setConversationId(convId);
            setShowHistory(false);
        } catch (e) {
            // ignore
        }
    };

    const newChat = () => {
        setMessages([]);
        setConversationId(null);
        setShowHistory(false);
    };

    const typeWriter = useCallback((fullText, onUpdate, onDone) => {
        let i = 0;
        const speed = 15; // ms per character
        const tick = () => {
            if (i < fullText.length) {
                // Add a few chars at a time for speed
                const chunk = fullText.slice(i, i + 3);
                i += 3;
                onUpdate(fullText.slice(0, i));
                setTimeout(tick, speed);
            } else {
                onUpdate(fullText);
                onDone();
            }
        };
        tick();
    }, []);

    const sendMessage = async () => {
        const text = input.trim();
        if (!text || loading) return;

        const userMessage = { role: 'user', content: text };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        // Show thinking bubble
        setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

        try {
            const res = await axios.post('/api/chat/send', {
                message: text,
                conversation_id: conversationId,
            });

            const { content, conversation_id: convId } = res.data;
            if (convId) setConversationId(convId);

            // Animate typing
            typeWriter(content, (partial) => {
                setMessages(prev => {
                    const updated = [...prev];
                    updated[updated.length - 1] = { role: 'assistant', content: partial };
                    return updated;
                });
            }, () => {
                setLoading(false);
            });
        } catch (e) {
            setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' };
                return updated;
            });
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setOpen(!open)}
                className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${
                    open ? 'bg-gray-600 rotate-0' : 'bg-primary rotate-0'
                }`}
            >
                <span className="material-symbols-outlined text-white text-2xl">
                    {open ? 'close' : 'chat'}
                </span>
            </button>

            {/* Chat Panel */}
            <div className={`fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] transition-all duration-300 origin-bottom-right ${
                open ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-75 opacity-0 pointer-events-none'
            }`}>
                <div className="bg-[#FFF8F0] rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col" style={{ height: '520px' }}>

                    {/* Header */}
                    <div className="bg-primary px-4 py-3 flex items-center gap-3">
                        <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-lg">smart_toy</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-handwriting text-white text-lg font-bold leading-tight">Life Assistant</h3>
                            <p className="text-white/70 text-[11px]">Your personal AI companion</p>
                        </div>
                        <button onClick={newChat} className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors" title="New chat">
                            <span className="material-symbols-outlined text-white text-sm">add</span>
                        </button>
                        <button onClick={loadConversations} className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors" title="Chat history">
                            <span className="material-symbols-outlined text-white text-sm">history</span>
                        </button>
                    </div>

                    {/* History Panel */}
                    {showHistory ? (
                        <div className="flex-1 overflow-auto p-3 space-y-2">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-handwriting text-lg font-bold text-gray-700">Chat History</span>
                                <button onClick={() => setShowHistory(false)} className="text-xs text-primary hover:underline">Back</button>
                            </div>
                            {conversations.length === 0 ? (
                                <p className="font-note text-gray-400 text-sm text-center py-8">No conversations yet</p>
                            ) : (
                                conversations.map((conv, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => loadConversation(conv.conversation_id)}
                                        className="w-full text-left p-3 bg-white rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-primary/5 transition-colors"
                                    >
                                        <p className="font-note text-sm text-gray-700 truncate">{conv.first_message}</p>
                                        <p className="text-[11px] text-gray-400 mt-1">{new Date(conv.last_at).toLocaleDateString()}</p>
                                    </button>
                                ))
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Messages */}
                            <div className="flex-1 overflow-auto p-3 space-y-3">
                                {messages.length === 0 && (
                                    <div className="flex flex-col items-center justify-center h-full text-center px-4">
                                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                            <span className="material-symbols-outlined text-primary text-3xl">waving_hand</span>
                                        </div>
                                        <p className="font-handwriting text-xl font-bold text-gray-700 mb-1">Hi there!</p>
                                        <p className="font-note text-sm text-gray-400 leading-relaxed">
                                            I'm your personal Life OS assistant. Ask me anything about planning, productivity, or just chat!
                                        </p>
                                        <div className="mt-4 flex flex-wrap gap-2 justify-center">
                                            {['Plan my day', 'Give me motivation', 'Help with goals'].map((suggestion, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => { setInput(suggestion); }}
                                                    className="text-xs font-note bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full hover:border-primary/30 hover:text-primary transition-colors"
                                                >
                                                    {suggestion}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        {msg.role === 'assistant' && (
                                            <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                                                <span className="material-symbols-outlined text-primary text-sm">smart_toy</span>
                                            </div>
                                        )}
                                        <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                                            msg.role === 'user'
                                                ? 'bg-primary text-white rounded-br-md'
                                                : 'bg-white border border-gray-100 text-gray-700 rounded-bl-md shadow-sm'
                                        }`}>
                                            {msg.role === 'assistant' ? (
                                                <div className="font-note"><MarkdownText content={msg.content} /></div>
                                            ) : (
                                                <span className="font-note">{msg.content}</span>
                                            )}
                                            {msg.role === 'assistant' && !msg.content && loading && (
                                                <div className="flex items-center gap-2 py-1">
                                                    <div className="flex gap-1">
                                                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                                    </div>
                                                    <span className="text-xs text-gray-400 font-note">Thinking...</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div className="p-3 border-t border-gray-100 bg-white/50">
                                <div className="flex items-end gap-2">
                                    <textarea
                                        ref={inputRef}
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Type a message..."
                                        rows={1}
                                        className="flex-1 resize-none border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-note focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 bg-white placeholder-gray-400"
                                        style={{ maxHeight: '80px' }}
                                    />
                                    <button
                                        onClick={sendMessage}
                                        disabled={!input.trim() || loading}
                                        className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                                    >
                                        <span className="material-symbols-outlined text-lg">
                                            {loading ? 'hourglass_empty' : 'send'}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
