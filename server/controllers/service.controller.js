const Service = require('../models/service.model');

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




module.exports = {
    addService,
    getOtherUsersServices,
    getMyServices
};
