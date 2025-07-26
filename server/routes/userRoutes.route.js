const express = require('express');
const router = express.Router();
const { registerUser, loginUser,getMe,updateUser } = require('../controllers/user.controller');
const protect = require('../middlewares/authMiddleware');
const { deleteUser } = require('../controllers/user.controller'); 


router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.patch('/update', protect, updateUser);
router.delete('/:id', protect, deleteUser);


module.exports = router;
