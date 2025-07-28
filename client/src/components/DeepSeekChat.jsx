import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Sparkles } from 'lucide-react';

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
    const [welcomeInitialized, setWelcomeInitialized] = useState(false);

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
        // Disable automatic scrolling on new messages
        // Users can manually scroll to see new content
    }, [messages, welcomeInitialized, isUserAtBottom]);

    useEffect(() => {
        // Disable automatic scrolling during streaming
        // Users can manually scroll to follow the conversation
    }, [streamingMessage]);

    useEffect(() => {
        // Initialize welcome message without scrolling
        if (!welcomeInitialized && user?.name) {
            const welcome = {
                id: Date.now().toString(),
                content: `Hello ${user.name}! I'm your GlobeAid AI assistant. How can I help you today?`,
                isUser: false,
                timestamp: new Date(),
            };
            setMessages([welcome]);
            setWelcomeInitialized(true);
            // Ensure user is considered at bottom after welcome message
            setIsUserAtBottom(true);
        }
    }, [user, welcomeInitialized]);

    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 100) + 'px';
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
                // Removed automatic scrolling - user can scroll manually
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

        // Removed automatic scrolling - user can scroll manually to see their message

        if (textareaRef.current) {
            textareaRef.current.style.height = '40px';
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

    return (
        <div className="min-h-screen bg-gray-800 flex items-center justify-center p-4">
            {/* Chat Box Container */}
            <div className="w-full max-w-3xl h-[600px] bg-gray-900 rounded-lg shadow-2xl border border-gray-700 flex flex-col overflow-hidden">
                
                {/* Header */}
                <div className="bg-gray-800 px-4 py-3 border-b border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h3 className="text-white font-medium">GlobeAid AI</h3>
                            <p className="text-gray-400 text-sm">Travel Assistant</p>
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4" onScroll={handleScroll}>
                    {messages.length === 0 && !isStreaming && (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <Sparkles className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                                <h3 className="text-gray-200 mb-2">How can I help you today?</h3>
                                <p className="text-gray-400 text-sm">Ask me about travel, destinations, or planning.</p>
                            </div>
                        </div>
                    )}

                    {messages.map((message) => (
                        <div key={message.id} className="mb-4">
                            <div className={`flex gap-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                                {!message.isUser && (
                                    <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Sparkles className="w-4 h-4 text-white" />
                                    </div>
                                )}
                                <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                                    message.isUser 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-gray-700 text-gray-100'
                                }`}>
                                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                                </div>
                                {message.isUser && (
                                    <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <User className="w-4 h-4 text-white" />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {isStreaming && (
                        <div className="mb-4">
                            <div className="flex gap-3 justify-start">
                                <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                                <div className="max-w-xs lg:max-w-md px-3 py-2 rounded-lg bg-gray-700 text-gray-100">
                                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                                        {streamingMessage}<span className="inline-block w-1 h-4 bg-gray-100 ml-1 animate-pulse"></span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {loading && !isStreaming && (
                        <div className="mb-4">
                            <div className="flex gap-3 justify-start">
                                <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                                <div className="px-3 py-2 rounded-lg bg-gray-700">
                                    <div className="flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-gray-700">
                    <div className="flex gap-2">
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message..."
                            disabled={loading || isStreaming}
                            className="flex-1 resize-none bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-gray-500 text-sm"
                            rows={1}
                            style={{ minHeight: '40px', maxHeight: '100px' }}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || loading || isStreaming}
                            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DeepSeekChat;