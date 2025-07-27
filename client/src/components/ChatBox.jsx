import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { X } from 'lucide-react';

const socket = io('http://localhost:8000'); // Use env in production

const ChatBox = ({ userId, receiverId, isOpen, onClose, userName = 'You', receiverName = 'User' }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const messageEndRef = useRef(null);

    useEffect(() => {
        if (userId) {
            socket.emit('join_room', userId);
        }

        const handleReceiveMessage = (data) => {
            setMessages((prev) => [...prev, {
                ...data,
                from: data.sender === userId ? 'self' : 'other'
            }]);
        };

        socket.on('receive_message', handleReceiveMessage);

        return () => {
            socket.off('receive_message', handleReceiveMessage);
        };
    }, [userId]);

    useEffect(() => {
        const fetchOldMessages = async () => {
            try {
                const res = await fetch(`http://localhost:8000/api/messages/chat/${receiverId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                const data = await res.json();
                if (!Array.isArray(data)) {
                    console.error("Unexpected response:", data);
                    return;
                }

                setMessages(
                    data.map((msg) => ({
                        ...msg,
                        from: msg.sender === userId ? 'self' : 'other',
                    }))
                );
            } catch (err) {
                console.error("Failed to fetch messages", err);
            }
        };

        if (receiverId) {
            fetchOldMessages();
        }
    }, [receiverId, userId]);

    const sendMessage = async () => {
        if (!message.trim()) return;

        const msgData = {
            sender: userId,
            receiver: receiverId,
            content: message,
        };

        socket.emit('send_message', msgData);
        setMessage('');
    };

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex flex-col h-[500px] w-full bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gray-900 text-white">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-white">
                            {receiverName.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-white">{receiverName}</h3>
                        <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <p className="text-xs text-gray-300">Online</p>
                        </div>
                    </div>
                </div>
                {onClose && (
                    <button 
                        onClick={onClose} 
                        className="p-2 hover:bg-gray-800 rounded-full transition-colors duration-200"
                    >
                        <X className="w-4 h-4 text-gray-300 hover:text-white" />
                    </button>
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.from === 'self' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[70%] ${msg.from === 'self' ? 'order-2' : 'order-1'}`}>
                            <div className="flex items-center mb-2">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mr-2 ${
                                    msg.from === 'self' 
                                        ? 'bg-gray-800 text-white' 
                                        : 'bg-gray-600 text-white'
                                }`}>
                                    {msg.from === 'self' ? userName.charAt(0).toUpperCase() : receiverName.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-xs text-gray-500 font-medium">
                                    {msg.from === 'self' ? userName : receiverName}
                                </span>
                            </div>
                            <div
                                className={`px-4 py-3 rounded-2xl text-sm transition-all duration-200 ${
                                    msg.from === 'self'
                                        ? 'bg-gray-900 text-white rounded-br-md shadow-sm'
                                        : 'bg-white text-gray-900 rounded-bl-md shadow-sm border border-gray-200'
                                }`}
                            >
                                {msg.content}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messageEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex items-center space-x-3">
                    <input
                        className="flex-1 border border-gray-300 rounded-full px-4 py-3 text-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all duration-200 placeholder-gray-400"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={`Message ${receiverName}...`}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage();
                            }
                        }}
                    />
                    <button
                        onClick={sendMessage}
                        className="bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors duration-200 text-sm font-medium"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;