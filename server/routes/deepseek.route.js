const express = require('express');
const router = express.Router();
const axios = require('axios');

require('dotenv').config();

router.post('/chat', async (req, res) => {
    const { messages } = req.body;

    const prompt = {
        role: "system",
        content: `You are GlobeAid, a friendly travel assistant... If the user shares their name (${userName}), greet them personally.`
    };



    try {
        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: 'deepseek/deepseek-chat-v3-0324',
                messages: [prompt, ...messages],
                temperature: 0.7,
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.ATLAS_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const reply = response.data.choices[0].message.content;
        res.json({ reply });

    } catch (error) {
        console.error('Deepseek API error:', error?.response?.data || error.message);
        res.status(500).json({ error: 'Failed to communicate with DeepSeek AI' });
    }
});

module.exports = router;
