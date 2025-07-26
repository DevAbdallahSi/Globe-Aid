const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http'); // <-- Required for socket.io
const { Server } = require('socket.io');
const connectDB = require('./config/mongoose.config');
const deepseekRoutes = require('./routes/deepseek.route');
const chatRoutes = require('./routes/messages.route');
const Message = require('./models/Message'); // <-- Import your Message model
const feedbackRoutes = require('./routes/feedback.route');



// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize express app
const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api/deepseek', deepseekRoutes);
app.use('/api/users', require('./routes/userRoutes.route'));
app.use('/api/messages', chatRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/services',require('./routes/serviceRoutes.route'))

// Root Route
app.get('/', (req, res) => {
    res.send('API running...');
});

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        credentials: true
    }
});

// Handle socket connections
io.on('connection', (socket) => {
    console.log('🔌 New client connected:', socket.id);

    // Join user's personal room
    socket.on('join_room', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined their room`);
    });

    // Handle message sending
    socket.on('send_message', async (data) => {
        const { sender, receiver, content } = data;
        try {
            const newMessage = new Message({ sender, receiver, content });
            await newMessage.save();
            io.to(receiver).emit('receive_message', newMessage);
        } catch (error) {
            console.error('❌ Message save error:', error.message);
        }
    });

    socket.on('disconnect', () => {
        console.log('❌ Client disconnected:', socket.id);
    });
});

// Start server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`✅ Server + WebSocket running on http://localhost:${PORT}`);
});
