const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const User = require("./models/User");
const Rating = require("./models/Rating");
const ratingRoutes = require("./routes/rating");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Bağlantısı
mongoose.connect("mongodb+srv://admin:tugbapipi@tto.5cugmxz.mongodb.net/tto-app?retryWrites=true&w=majority&appName=TTO", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("✅ MongoDB bağlantısı başarılı"))
    .catch(err => console.error("❌ MongoDB bağlantı hatası:", err));

// Rating route bağlama
app.use("/rate", ratingRoutes);

// Kayıt Route
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
        points: {}  // Yeni kullanıcı için boş puan listesi
    });

    await newUser.save();

    const token = jwt.sign({ email }, "gizli_anahtar", { expiresIn: "1h" });
    res.status(201).json({ message: "Kayıt başarılı", token, name });
});

// Giriş Route
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
        userId: user._id,          // Gerekirse frontend'e gönder
        points: user.points || {}  // Puanları da gönder
    });
});

// Sunucuyu başlat
app.listen(5000, () => {
    console.log("✅ Sunucu http://localhost:5000 adresinde çalışıyor");
});
