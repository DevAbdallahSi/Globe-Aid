const express = require('express');
const router = express.Router();
const { registerUser, loginUser,getMe,updateUser } = require('../controllers/user.controller');
const protect = require('../middlewares/authMiddleware');



router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.patch('/update', protect, updateUser);

module.exports = router;
