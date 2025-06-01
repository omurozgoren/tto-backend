const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    skillsHave: {
        type: [String],
        default: []
    },
    skillsWant: {
        type: [String],
        default: []
    },
    points: {
        type: Map,
        of: Number,
        default: {} // 👈 Her kullanıcı için başlangıçta boş puan tablosu
    }
});

module.exports = mongoose.model("User", userSchema);
