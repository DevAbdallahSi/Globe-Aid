const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  updateUser,
  deleteUser,
  getUserById // ✅ added
} = require('../controllers/user.controller');
const protect = require('../middlewares/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.patch('/update', protect, updateUser);
router.delete('/:id', protect, deleteUser);
router.get('/:id', protect, getUserById); // ✅ added route

module.exports = router;
