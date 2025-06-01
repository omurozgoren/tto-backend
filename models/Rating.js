const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    skill: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    }
});

module.exports = mongoose.model("Rating", ratingSchema);
