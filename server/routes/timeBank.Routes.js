const express = require('express');
const router = express.Router();
const { getTimeHistory } = require('../controllers/timeBank.Controller');
const protect = require('../middlewares/authMiddleware');

router.get('/history', protect, getTimeHistory);

module.exports = router;
