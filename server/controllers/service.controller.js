const mongoose = require('mongoose');
const Service = require('../models/service.model');
const ServiceRequest = require('../models/serviceRequest.model');
const User = require('../models/user.model');
const TimeBank = require('../models/timeBankModel'); // adjust path as needed

const addService = async (req, res) => {
    const { title, category, description, duration, location } = req.body;
    const userId = req.user.id;

    console.log("Incoming service data:", { title, category, description, duration, location });
    console.log("Authenticated user ID:", userId);
    try {
        const newService = await Service.create({
            title,
            category,
            description,
            duration,
            location,
            user: userId
        });

        // Populate user so the frontend can display provider name
        await newService.populate('user', 'name');

        console.log("✅ Service created:", newService);

        // ⬇️ Emit the newService event to all connected clients
        const io = req.app.get('io');
        io.emit('newService', newService);

        res.status(201).json(newService);
    } catch (err) {
        console.error("❌ Failed to create service:", err);
        res.status(500).json({ message: 'Error creating service', error: err.message });
    }
};


const getOtherUsersServices = async (req, res) => {
    try {
        const services = await Service.find({ user: { $ne: req.user.id } }).populate('user', 'name');
        res.status(200).json(services);
    } catch (err) {
        res.status(500).json({ message: 'Failed to get services', error: err.message });
    }
};

const getMyServices = async (req, res) => {
    try {
        const myServices = await Service.find({ user: req.user.id });
        res.status(200).json(myServices);
    } catch (err) {
        console.error("Error fetching user services:", err);
        res.status(500).json({ message: "Error fetching your services" });
    }
};



const requestService = async (req, res) => {
    const { serviceId } = req.params;
    const userId = req.user?.id;

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
        return res.status(400).json({ message: 'Invalid service ID' });
    }

    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    try {
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        // Prevent duplicate requests
        const alreadyRequested = await ServiceRequest.findOne({
            service: serviceId,
            requester: userId
        });

        if (alreadyRequested) {
            return res.status(400).json({ message: 'You have already requested this service' });
        }

        // ✅ Create the actual ServiceRequest document
        const newRequest = await ServiceRequest.create({
            service: serviceId,
            requester: userId,
            status: 'pending'  // optional — default is already pending
        });

        // Optional: update legacy Service.requests[] array
        if (!Array.isArray(service.requests)) {
            service.requests = [];
        }
        service.requests.push(userId);
        await service.save();

        return res.status(200).json({ message: 'Service requested successfully', request: newRequest });

    } catch (err) {
        console.error("❌ Error requesting service:", err);
        res.status(500).json({ message: 'Error requesting service', error: err.message });
    }
};



const getMyServiceRequests = async (req, res) => {
    try {
        // Find services owned by this user
        const services = await Service.find({ user: req.user.id }).populate('requests', 'name email');

        // Only return services that have at least 1 request
        const servicesWithRequests = services.filter(service => service.requests.length > 0);

        res.status(200).json(servicesWithRequests);
    } catch (err) {
        console.error("❌ Error getting service requests:", err);
        res.status(500).json({ message: 'Error fetching requests for your services', error: err.message });
    }
};


const getRequestsByService = async (req, res) => {
    const { serviceId } = req.params;

    try {
        const requests = await ServiceRequest.find({ service: serviceId })  // ❌ removed status filter
            .populate('requester', 'name email');

        res.status(200).json(requests);
    } catch (err) {
        console.error("❌ Error fetching requests by service:", err);
        res.status(500).json({ message: 'Error fetching requests', error: err.message });
    }
};


const getServicesUserRequested = async (req, res) => {
    try {
        const requests = await ServiceRequest.find({ requester: req.user.id }).populate('service');
        res.status(200).json(requests);
    } catch (err) {
        console.error("❌ Error fetching user requested services:", err);
        res.status(500).json({ message: 'Failed to load requested services', error: err.message });
    }
};


const cancelServiceRequest = async (req, res) => {
    const { requestId } = req.params;
    try {
        const request = await ServiceRequest.findOneAndDelete({
            _id: requestId,
            requester: req.user.id
        });

        if (!request) {
            return res.status(404).json({ message: "Request not found or not owned by user" });
        }

        // ✅ Remove user ID from service.requests array
        await Service.findByIdAndUpdate(
            request.service,
            { $pull: { requests: req.user.id } }
        );

        res.status(200).json({ message: "Request canceled successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to cancel request", error: err.message });
    }
};


const updateServiceRequestStatus = async (req, res) => {
    const { requestId } = req.params;
    const { status } = req.body;

    if (!['accepted', 'declined'].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
    }

    try {
        const request = await ServiceRequest.findById(requestId)
            .populate('requester', 'name email hoursSpent')
            .populate('service'); // Includes service with duration and user (provider)

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        request.status = status;
        await request.save();

        if (status === 'declined') {
            await Service.findByIdAndUpdate(
                request.service._id,
                { $pull: { requests: request.requester._id } }
            );
        }

        if (status === 'accepted') {
            const duration = request.service.duration;
            const providerId = request.service.user;
            const requesterId = request.requester._id;

            // ✅ Update time stats
            await User.findByIdAndUpdate(providerId, { $inc: { hoursEarned: duration } });
            await User.findByIdAndUpdate(requesterId, { $inc: { hoursSpent: duration } });

            // ✅ Create TimeBank entries
            await TimeBank.create([
                {
                    user: providerId,
                    type: 'earned',
                    service: request.service.title,
                    with: request.requester.name,
                    hours: duration,
                    date: new Date()
                },
                {
                    user: requesterId,
                    type: 'spent',
                    service: request.service.title,
                    with: request.service.user.name || 'Service Provider',
                    hours: duration,
                    date: new Date()
                }
            ]);

            // ✅ Emit timebankUpdated event to both users
            const io = req.app.get('io');
            if (io) {
                io.to(providerId.toString()).emit('timebankUpdated');
                io.to(requesterId.toString()).emit('timebankUpdated');
            }
        }

        res.status(200).json(request);
    } catch (err) {
        console.error("❌ Failed to update status:", err.message);
        res.status(500).json({ message: "Error updating request status", error: err.message });
    }
};





module.exports = {
    addService,
    getOtherUsersServices,
    getMyServices,
    requestService,
    getMyServiceRequests,
    getRequestsByService,
    getServicesUserRequested,
    cancelServiceRequest,
    updateServiceRequestStatus
};
