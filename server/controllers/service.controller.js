const mongoose = require('mongoose');
const Service = require('../models/service.model');
const ServiceRequest = require('../models/serviceRequest.model');

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
        console.log("✅ Service created:", newService);

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
        const requests = await ServiceRequest.find({ service: serviceId })
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
        const deleted = await ServiceRequest.findOneAndDelete({
            _id: requestId,
            requester: req.user.id
        });

        if (!deleted) {
            return res.status(404).json({ message: "Request not found or not owned by user" });
        }

        res.status(200).json({ message: "Request canceled successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to cancel request", error: err.message });
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
    cancelServiceRequest
};
