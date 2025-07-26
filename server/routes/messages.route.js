const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { getMessagesWithUser } = require('../controllers/message.controller');
const protect = require('../middlewares/authMiddleware'); // Make sure this path is correct


router.get('/chat/:otherUserId', protect, getMessagesWithUser);


router.post('/', async (req, res) => {
  try {
    const { sender, receiver, content } = req.body;
    const message = new Message({ sender, receiver, content });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: 'Message failed to save' });
  }
});

router.get('/:userId/:otherId', async (req, res) => {
  try {
    const { userId, otherId } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherId },
        { sender: otherId, receiver: userId }
      ]
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load messages' });
  }
});

module.exports = router;
