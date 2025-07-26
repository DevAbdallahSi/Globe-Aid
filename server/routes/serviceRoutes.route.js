const express = require('express');
const { addService, getOtherUsersServices , getMyServices } = require('../controllers/service.controller');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, addService);
router.get('/others', authMiddleware, getOtherUsersServices);
router.get('/mine', authMiddleware, getMyServices);

module.exports = router;
