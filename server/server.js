const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/mongoose.config');
const deepseekRoutes = require('./routes/deepseek.route');
const chatRoutes = require('./routes/messages.route');
const Message = require('./models/Message');
const feedbackRoutes = require('./routes/feedback.route');



// Load .env config
dotenv.config();

// Connect to DB
connectDB();

// Init app
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/deepseek', deepseekRoutes);
app.use('/api/users', require('./routes/userRoutes.route'));
app.use('/api/messages', chatRoutes);
app.use('/api/services', require('./routes/serviceRoutes.route'));

app.get('/', (req, res) => res.send('API running...'));

app.use('/api/feedback', feedbackRoutes);
app.use('/api/services',require('./routes/serviceRoutes.route'))


// Create HTTP server
const server = http.createServer(app);

// Init Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true
  }
});

// Socket.IO logic
io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);

  socket.on('join_room', (userId) => {
    socket.join(userId);
    console.log(`✅ User ${userId} joined their room`);
  });

socket.on('send_message', async (data) => {
  const { sender, receiver, content } = data;

  try {
    const newMessage = new Message({ sender, receiver, content });
    await newMessage.save();

    // Emit to BOTH users
    io.to(receiver).emit('receive_message', newMessage);
    io.to(sender).emit('receive_message', newMessage); // sender also receives for sync
  } catch (err) {
    console.error('❌ Message save error:', err.message);
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
