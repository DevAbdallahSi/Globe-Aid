// const express = require('express');
// const cors = require('cors')
// const app = express();
// require('./config/mongoose.config');
// app.use(cors())
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// require('dotenv').config()
// const PORT = process.env.PORT;
// require ('./routes/player.routes')(app);
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/mongoose.config');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize app
const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Frontend origin
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/userRoutes.route'));

// Root Route
app.get('/', (req, res) => {
    res.send('API running...');
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
