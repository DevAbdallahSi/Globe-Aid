// // routes/ai.routes.js
// const express = require('express');
// const axios = require('axios');
// const router = express.Router();

// // POST /api/ai/chat
// router.post('/chat', async (req, res) => {
//     const { message } = req.body;

//     if (!message) {
//         return res.status(400).json({ error: 'Message is required' });
//     }

//     try {
//         const response = await axios.post(
//             'https://openrouter.ai/api/v1/chat/completions',
//             {
//                 model: 'deepseek-chat', // You can use 'deepseek-coder' for coding tasks
//                 messages: [
//                     {
//                         role: 'system',
//                         content: 'You are a helpful assistant for newcomers who need cultural and emotional support.',
//                     },
//                     {
//                         role: 'user',
//                         content: message,
//                     },
//                 ],
//             },
//             {
//                 headers: {
//                     'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
//                     'Content-Type': 'application/json',
//                     'HTTP-Referer': 'https://globeaid.com', // optional but recommended
//                 },
//             }
//         );

//         const aiReply = response.data.choices[0]?.message?.content || 'No response';
//         res.json({ reply: aiReply });
//     } catch (err) {
//         console.error('AI API error:', err?.response?.data || err.message);
//         res.status(500).json({ error: 'Failed to get AI response' });
//     }
// });

// module.exports = router;
