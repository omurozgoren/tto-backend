// routes/friends.js
const express = require("express");
const router = express.Router();
const Friend = require("../models/Friend");

// POST /api/friends
router.post("/", async (req, res) => {
    const { userEmail, friendEmail } = req.body;

    if (!userEmail || !friendEmail) {
        return res.status(400).json({ error: "Eksik bilgi." });
    }

    try {
        const newFriend = new Friend({ userEmail, friendEmail });
        await newFriend.save();
        res.status(201).json({ message: "Arkadaş eklendi." });
    } catch (err) {
        console.error("Arkadaş ekleme hatası:", err);
        res.status(500).json({ error: "Sunucu hatası." });
    }
});

module.exports = router;
