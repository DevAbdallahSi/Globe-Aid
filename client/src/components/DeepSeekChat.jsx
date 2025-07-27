import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, MessageSquare, User, Sparkles } from 'lucide-react';

const DeepSeekChat = ({ user }) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [streamingMessage, setStreamingMessage] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);
    const chatContainerRef = useRef(null);
    const [isUserAtBottom, setIsUserAtBottom] = useState(true);

    const scrollToBottom = (force = false) => {
        if (force || isUserAtBottom) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleScroll = () => {
        const container = chatContainerRef.current;
        if (container) {
            const { scrollTop, scrollHeight, clientHeight } = container;
            const isAtBottom = scrollTop + clientHeight >= scrollHeight - 100;
            setIsUserAtBottom(isAtBottom);
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isStreaming && isUserAtBottom) {
            const timeout = setTimeout(() => {
                scrollToBottom();
            }, 100);
            return () => clearTimeout(timeout);
        }
    }, [isStreaming]);

    useEffect(() => {
        if (messages.length === 0 && user?.name) {
            const welcome = {
                id: Date.now().toString(),
                content: `Hello ${user.name}! I'm your GlobeAid AI assistant. How can I help you plan your next adventure today?`,
                isUser: false,
                timestamp: new Date(),
            };
            setMessages([welcome]);
        }
    }, [user]);

    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
        }
    };

    const simulateStreaming = (text) => {
        setIsStreaming(true);
        setStreamingMessage('');

        const words = text.split(' ');
        let currentIndex = 0;

        const streamInterval = setInterval(() => {
            if (currentIndex < words.length) {
                setStreamingMessage(prev => prev + (currentIndex > 0 ? ' ' : '') + words[currentIndex]);
                currentIndex++;
            } else {
                clearInterval(streamInterval);
                setIsStreaming(false);
                const aiMessage = {
                    id: Date.now().toString(),
                    content: text,
                    isUser: false,
                    timestamp: new Date(),
                };
                setMessages(prev => [...prev, aiMessage]);
                setStreamingMessage('');
            }
        }, 50);
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading || isStreaming) return;

        const userMessage = {
            id: Date.now().toString(),
            content: input.trim(),
            isUser: true,
            timestamp: new Date(),
        };

        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput('');
        setLoading(true);

        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }

        try {
            const res = await fetch('http://localhost:8000/api/deepseek/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: updatedMessages.map(msg => ({
                        role: msg.isUser ? 'user' : 'assistant',
                        content: msg.content
                    })),
                    userName: user?.name || 'Traveler'
                })
            });

            if (!res.ok) throw new Error('Network response was not ok');

            const data = await res.json();

            const cleanText = data.reply
                .replace(/^#+\s?/gm, '')
                .replace(/\*\*(.*?)\*\*/g, '$1')
                .replace(/\*(.*?)\*/g, '$1')
                .replace(/^- /gm, '• ')
                .replace(/\r?\n|\r/g, '\n');

            simulateStreaming(cleanText);

        } catch (err) {
            const errorMessage = {
                id: Date.now().toString(),
                content: 'I apologize, but I encountered an error. Please try again.',
                isUser: false,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        }

        setLoading(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend(e);
        }
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);
        adjustTextareaHeight();
    };

    const newChat = () => {
        setMessages([]);
        setStreamingMessage('');
        setIsStreaming(false);
        setInput('');
    };

    return (
        <div className="flex h-screen bg-gray-800">
            {/* Sidebar */}
            <div className="w-64 bg-gray-900 text-white flex flex-col border-r border-gray-700">
                <div className="p-4">
                    <button onClick={newChat} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg border border-gray-600 hover:bg-gray-700 transition-colors">
                        <Plus className="w-4 h-4" />
                        <span className="text-sm">New chat</span>
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto px-2">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-700 text-sm">
                            <MessageSquare className="w-4 h-4" />
                            <span className="truncate">GlobeAid AI Chat</span>
                        </div>
                    </div>
                </div>
                <div className="p-4 border-t border-gray-700">
                    <div className="flex items-center gap-3 px-3 py-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm truncate">{user?.name || 'User'}</span>
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-gray-800">
                <div ref={chatContainerRef} className="flex-1 overflow-y-auto" onScroll={handleScroll}>
                    <div className="max-w-3xl mx-auto">
                        {messages.length === 0 && !isStreaming && (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center py-12">
                                    <Sparkles className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                                    <h3 className="text-xl font-medium text-gray-200 mb-2">How can I help you today?</h3>
                                    <p className="text-gray-400">Ask me anything about travel, destinations, or planning your next adventure.</p>
                                </div>
                            </div>
                        )}

                        {messages.map((message) => (
                            <div key={message.id} className={`py-6 px-4 ${message.isUser ? 'bg-gray-800' : 'bg-gray-750'}`}>
                                <div className="max-w-3xl mx-auto flex gap-4">
                                    <div className="flex-shrink-0">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.isUser ? 'bg-blue-600' : 'bg-green-500'}`}>
                                            {message.isUser ? <User className="w-4 h-4 text-white" /> : <Sparkles className="w-4 h-4 text-white" />}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="prose prose-sm max-w-none">
                                            <p className="text-gray-100 leading-relaxed whitespace-pre-wrap m-0">{message.content}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isStreaming && (
                            <div className="py-6 px-4 bg-gray-750">
                                <div className="max-w-3xl mx-auto flex gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                            <Sparkles className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="prose prose-sm max-w-none">
                                            <p className="text-gray-100 leading-relaxed whitespace-pre-wrap m-0">
                                                {streamingMessage}<span className="inline-block w-2 h-5 bg-gray-100 ml-1 animate-pulse"></span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {loading && !isStreaming && (
                            <div className="py-6 px-4 bg-gray-750">
                                <div className="max-w-3xl mx-auto flex gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                            <Sparkles className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1">
                                            <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                </div>

                <div className="border-t border-gray-700 bg-gray-800 p-4">
                    <div className="max-w-3xl mx-auto">
                        <form onSubmit={handleSend} className="relative">
                            <div className="flex items-end gap-3 bg-gray-700 border border-gray-600 rounded-xl shadow-sm focus-within:border-gray-500 transition-colors">
                                <textarea
                                    ref={textareaRef}
                                    value={input}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Message GlobeAid AI..."
                                    disabled={loading || isStreaming}
                                    className="flex-1 resize-none border-0 bg-transparent px-4 py-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-0 max-h-48"
                                    rows={1}
                                    style={{ minHeight: '44px' }}
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || loading || isStreaming}
                                    className="m-2 p-2 rounded-lg bg-gray-600 text-white hover:bg-gray-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </form>
                        <p className="text-xs text-gray-400 mt-2 text-center">
                            GlobeAid AI can make mistakes. Consider checking important information.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeepSeekChat;
