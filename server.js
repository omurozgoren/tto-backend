const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const app = express();
app.use(cors()); // 🔥 Frontend'ten gelen istekleri kabul et
app.use(bodyParser.json());

const users = []; // Geçici kullanıcı verisi

// ✅ Kayıt Route
app.post("/register", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email ve şifre gereklidir." });
    }

    const userExists = users.find(u => u.email === email);
    if (userExists) {
        return res.status(400).json({ message: "Bu e-posta zaten var." });
    }

    const hashed = await bcrypt.hash(password, 10);
    users.push({ email, password: hashed });

    console.log("Yeni kullanıcı:", email);
    res.status(201).json({ message: "Kayıt başarılı", token: "example-token" });
});

// ✅ Giriş Route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(400).json({ message: "Kullanıcı bulunamadı" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.status(400).json({ message: "Şifre yanlış" });
    }

    const token = jwt.sign({ email }, "gizli_anahtar", { expiresIn: "1h" });
    res.json({ message: "Giriş başarılı", token });
});

// ✅ Sunucuyu Başlat
app.listen(5000, () => {
    console.log("✅ Sunucu http://localhost:5000 adresinde çalışıyor");
});
