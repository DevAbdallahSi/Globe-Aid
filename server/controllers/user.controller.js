const user = require('../models/user.model');

module.exports.createUser = (req, res) => {
    const { username, email,gender,details } = req.body;
    user.create({username, email,gender,details })
        .then(user => res.json(user))
        .catch(err => {
            console.error("❌ Error creating user:", err);
            res.status(400).json(err);
        });
}
module.exports.getAllUsers = (request, response) => {
    user.find({})
        .then(user => response.json(user))
        .catch(err => response.json(err))
}

module.exports.getUser = (request, response) => {
    user.findOne({ _id: request.params.id })
        .then(users => response.json(users))
        .catch(err => response.json(err))
}

module.exports.updateUser = (request, response) => {
    user.findOneAndUpdate({_id: request.params.id}, request.body, {new:true})
        .then(updateduser => response.json(updateduser))
        .catch(err => response.json(err))
}

module.exports.deleteUser = (request, response) => {
    user.deleteOne({ _id: request.params.id })
        .then(deleteConfirmation => response.json(deleteConfirmation))
        .catch(err => response.json(err))
}