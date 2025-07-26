import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:8000'); // Replace with production URL if needed

const ChatBox = ({ userId, receiverId }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const messageEndRef = useRef(null);

    useEffect(() => {
        socket.emit('join_room', userId);

        socket.on('receive_message', (data) => {
            setMessages(prev => [...prev, { ...data, from: 'other' }]);
        });

        return () => socket.off('receive_message');
    }, [userId]);

    const sendMessage = async () => {
        if (!message.trim()) return;

        const msgData = {
            senderId: userId,
            receiverId,
            content: message
        };

        socket.emit('send_message', msgData);

        // Save to DB
        await fetch('http://localhost:8000/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(msgData)
        });

        setMessages(prev => [...prev, { ...msgData, from: 'self' }]);
        setMessage('');
    };

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="chat-container border p-4 max-w-md mx-auto bg-white shadow">
            <div className="overflow-y-auto h-64 space-y-2 mb-2">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`p-2 rounded ${msg.from === 'self' ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 text-black self-start'}`}>
                        {msg.content}
                    </div>
                ))}
                <div ref={messageEndRef} />
            </div>
            <div className="flex space-x-2">
                <input
                    className="flex-1 border px-2 py-1"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button onClick={sendMessage} className="bg-blue-600 text-white px-4 py-1 rounded">Send</button>
            </div>
        </div>
    );
};

export default ChatBox;
