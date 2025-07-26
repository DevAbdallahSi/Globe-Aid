import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:8000'); // Use env in production

const ChatBox = ({ userId, receiverId }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const messageEndRef = useRef(null);

    // ✅ 1. Join only YOUR room once
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

    // ✅ 2. Load message history
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

    // ✅ 3. Send message (and rely on socket to reflect it in both UIs)
    const sendMessage = async () => {
        if (!message.trim()) return;

        const msgData = {
            sender: userId,
            receiver: receiverId,
            content: message,
        };

        socket.emit('send_message', msgData); // Server handles DB + socket broadcast

        setMessage('');
    };

    // Scroll to latest
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="chat-container border p-4 max-w-md mx-auto bg-white shadow rounded-lg">
            <div className="overflow-y-auto h-64 space-y-2 mb-2 px-2">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`p-2 rounded max-w-xs ${msg.from === 'self'
                                ? 'bg-blue-500 text-white ml-auto'
                                : 'bg-gray-200 text-black mr-auto'
                            }`}
                    >
                        {msg.content}
                    </div>
                ))}
                <div ref={messageEndRef} />
            </div>
            <div className="flex space-x-2">
                <input
                    className="flex-1 border px-2 py-1 rounded"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                        }
                    }}
                />
                <button onClick={sendMessage} className="bg-blue-600 text-white px-4 py-1 rounded">
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatBox;
