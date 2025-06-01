const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Rating = require("../models/Rating");

// POST /rate
router.post("/", async (req, res) => {
    const { fromUserId, toUserId, skill, score } = req.body;

    if (!fromUserId || !toUserId || !skill || !score) {
        return res.status(400).json({ message: "Eksik bilgi g�nderildi." });
    }

    if (fromUserId === toUserId) {
        return res.status(400).json({ message: "Kendini puanlayamazs�n." });
    }

    try {
        // Daha �nce ayn� ki�iyi ayn� yetenek i�in puanlad� m�?
        const existingRating = await Rating.findOne({ fromUserId, toUserId, skill });
        if (existingRating) {
            return res.status(400).json({ message: "Bu kullan�c�y� zaten puanlad�n." });
        }

        // Rating�i kaydet
        const rating = new Rating({ fromUserId, toUserId, skill, score });
        await rating.save();

        // Kullan�c�n�n puan�n� g�ncelle
        const toUser = await User.findById(toUserId);
        const currentPoints = toUser.points.get(skill) || 0;
        toUser.points.set(skill, currentPoints + score);
        await toUser.save();

        return res.json({ message: "Puan ba�ar�yla verildi." });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Bir hata olu�tu." });
    }
});

module.exports = router;
