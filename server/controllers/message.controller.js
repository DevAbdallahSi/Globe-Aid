// controllers/message.controller.js
const Message = require('../models/Message');

const getMessagesWithUser = async (req, res) => {
  try {
    const otherUserId = req.params.otherUserId;
    const myId = req.user.id;

    if (!myId || !otherUserId) {
      return res.status(400).json({ error: 'Missing user IDs' });
    }

    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: otherUserId },
        { sender: otherUserId, receiver: myId }
      ]
    }).sort('timestamp');

    res.status(200).json(messages);
  } catch (err) {
    console.error("❌ Error in getMessagesWithUser:", err.message);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};


module.exports = { getMessagesWithUser };
