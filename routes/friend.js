// routes/friend.js
const express = require("express");
const router = express.Router();
const Friend = require("../models/Friend");
const User = require("../models/User");

// Arkadaş ekle
router.post("/add", async (req, res) => {
    const { userEmail, friendEmail } = req.body;

    if (userEmail === friendEmail) {
        return res.status(400).json({ message: "Kendi kendini ekleyemezsin." });
    }

    const friendUser = await User.findOne({ email: friendEmail });
    if (!friendUser) {
        return res.status(404).json({ message: "Bu email ile kullanıcı bulunamadı." });
    }

    const existing = await Friend.findOne({ userEmail, friendEmail });
    if (existing) {
        return res.status(400).json({ message: "Zaten arkadaşsınız." });
    }

    const newFriend = new Friend({ userEmail, friendEmail });
    await newFriend.save();

    res.status(201).json({ message: "Arkadaş eklendi!" });
});

module.exports = router;
