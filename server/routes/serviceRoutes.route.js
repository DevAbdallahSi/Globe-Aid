const express = require('express');
const { addService, getOtherUsersServices, getMyServices, requestService, getMyServiceRequests,getServicesUserRequested,
    getRequestsByService,cancelServiceRequest } = require('../controllers/service.controller');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, addService);
router.get('/others', authMiddleware, getOtherUsersServices);
router.get('/mine', authMiddleware, getMyServices);

router.post('/request/:serviceId', authMiddleware, requestService);
router.get('/my-requests', authMiddleware, getMyServiceRequests);
router.get('/requests/:serviceId', authMiddleware, getRequestsByService);

router.get('/requested', authMiddleware, getServicesUserRequested);
router.delete('/request/:requestId', authMiddleware, cancelServiceRequest);



module.exports = router;
