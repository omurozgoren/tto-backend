// backend/models/Friend.js
const mongoose = require("mongoose");

const friendSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    friendEmail: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Friend", friendSchema);
