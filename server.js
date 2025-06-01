const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const User = require("./models/User");
const Rating = require("./models/Rating");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB bağlantısı
mongoose.connect("mongodb+srv://admin:tugbapipi@tto.5cugmxz.mongodb.net/tto-app?retryWrites=true&w=majority&appName=TTO", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("✅ MongoDB bağlantısı başarılı"))
    .catch(err => console.error("❌ MongoDB bağlantı hatası:", err));

// ✅ Kayıt Route
app.post("/register", async (req, res) => {
    const { name, email, password, skillsHave, skillsWant } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "İsim, e-posta ve şifre gereklidir." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "Bu e-posta zaten kayıtlı." });
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = new User({
        name,
        email,
        password: hashed,
        skillsHave,
        skillsWant,
        points: {}  // yeni alan: puanlar
    });

    await newUser.save();

    const token = jwt.sign({ email }, "gizli_anahtar", { expiresIn: "1h" });
    res.status(201).json({ message: "Kayıt başarılı", token, name });
});

// ✅ Giriş Route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Kullanıcı bulunamadı" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.status(400).json({ message: "Şifre yanlış" });
    }

    const token = jwt.sign({ email }, "gizli_anahtar", { expiresIn: "1h" });

    res.json({
        message: "Giriş başarılı",
        token,
        name: user.name,
        skillsHave: user.skillsHave,
        skillsWant: user.skillsWant,
        userId: user._id,
        points: user.points || {}
    });
});

// ✅ Belirli bir skill'e göre kullanıcıları sırala (puana göre)
app.get("/users", async (req, res) => {
    const skill = req.query.skill;
    if (!skill) return res.status(400).json({ message: "Skill gerekli." });

    const users = await User.find({ skillsHave: skill });

    const sorted = users.sort((a, b) => {
        const ap = a.points?.[skill] || 0;
        const bp = b.points?.[skill] || 0;
        return bp - ap;
    });

    res.json(sorted);
});

// ✅ Oy Verme (puanlama)
app.post("/rate", async (req, res) => {
    const { fromUserId, toUserId, skill, score } = req.body;

    if (!fromUserId || !toUserId || !skill || !score) {
        return res.status(400).json({ message: "Eksik veri." });
    }

    if (fromUserId === toUserId) {
        return res.status(400).json({ message: "Kendini oylayamazsın." });
    }

    const alreadyRated = await Rating.findOne({ fromUserId, toUserId, skill });
    if (alreadyRated) {
        return res.status(400).json({ message: "Bu kullanıcıyı zaten oyladınız." });
    }

    await Rating.create({ fromUserId, toUserId, skill, score });

    const user = await User.findById(toUserId);
    const current = user.points?.[skill] || 0;
    const updated = current + score;

    await User.findByIdAndUpdate(toUserId, {
        $set: { [`points.${skill}`]: updated }
    });

    res.json({ message: "Puan verildi." });
});

// ✅ Sunucuyu başlat
app.listen(5000, () => {
    console.log("✅ Sunucu http://localhost:5000 adresinde çalışıyor");
});
