import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, AlertCircle } from 'lucide-react';

const DeepSeekChat = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = {
            id: Date.now().toString(),
            content: input.trim(),
            isUser: true,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('http://localhost:8000/api/deepseek/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage.content }),
            });

            if (!res.ok) throw new Error('Network response was not ok');

            const data = await res.json();

            const aiMessage = {
                id: (Date.now() + 1).toString(),
                content: data.reply,
                isUser: false,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (err) {
            setError('Failed to get response from AI. Please try again.');
            console.error('Chat error:', err);
        }

        setLoading(false);
        inputRef.current?.focus();
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const LoadingDots = () => (
        <div className="flex space-x-1 items-center">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-white">GlobeAid AI Assistant</h1>
                            <p className="text-blue-100 text-sm">Powered by advanced AI technology</p>
                        </div>
                    </div>
                </div>

                {/* Chat Messages */}
                <div className="h-96 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                    {messages.length === 0 && (
                        <div className="text-center py-12">
                            <Bot className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-600 mb-2">Welcome to GlobeAid AI</h3>
                            <p className="text-gray-500">Start a conversation by typing your message below.</p>
                        </div>
                    )}

                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex items-start space-x-3 animate-slide-in ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''
                                }`}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.isUser
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-600'
                                }`}>
                                {message.isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                            </div>

                            <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${message.isUser
                                    ? 'bg-blue-600 text-white rounded-br-md'
                                    : 'bg-white text-gray-800 shadow-sm border rounded-bl-md'
                                }`}>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                                <p className={`text-xs mt-2 ${message.isUser ? 'text-blue-100' : 'text-gray-500'
                                    }`}>
                                    {formatTime(message.timestamp)}
                                </p>
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center flex-shrink-0">
                                <Bot className="w-4 h-4" />
                            </div>
                            <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border">
                                <LoadingDots />
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t bg-white p-6">
                    <form onSubmit={handleSend} className="flex items-end space-x-4">
                        <div className="flex-1">
                            <div className="relative">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type your message here..."
                                    disabled={loading}
                                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                                    maxLength={1000}
                                />
                                <div className="absolute right-3 bottom-3 text-xs text-gray-400">
                                    {input.length}/1000
                                </div>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={!input.trim() || loading}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-3 rounded-xl transition-all duration-200 disabled:cursor-not-allowed group"
                        >
                            <Send className="w-5 h-5 transform group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </form>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                        Press Enter to send • AI responses may take a few moments
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DeepSeekChat;
