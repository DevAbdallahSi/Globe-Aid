module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('🟢 A user connected:', socket.id);

        // Example: Receiving message from client
        socket.on('user-message', (data) => {
            console.log('💬 Message from client:', data);
            // Broadcast to all clients (except sender)
            socket.broadcast.emit('agent-reply', {
                message: `Echo from agent: ${data.message}`,
            });
        });

        // Optional: Handle disconnection
        socket.on('disconnect', () => {
            console.log('🔴 User disconnected:', socket.id);
        });
    });
};
