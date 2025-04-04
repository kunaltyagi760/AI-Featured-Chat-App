const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel")
const upload = require("../middleware/multer")
const twilio = require("twilio");

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const router = express.Router();

// Signup
router.post("/signup", upload.single("profileImage"), async (req, res) => {
    try {
        const { name, email, phone, password, location, age } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ $or: [{ email }, { phone }] });
        if (userExists) {
            return res.status(400).json({ message: "Email or Phone already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));

        // Get uploaded image URL from Cloudinary
        const profileImage = req.file ? req.file.path : "https://www.bing.com/th/id/OIP.AlIScK6urTegkZ178dAAGgHaHa?w=95&h=100&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2";

        // Create new user
        const user = new User({
            name,
            email,
            phone,
            password: hashedPassword,
            profileImage,
            location,
            age,
        });

        await user.save();
        res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ userId: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRY });

        const userData = user.toObject();
        delete userData.password;

        res.json({ 'msg': "Login Successfull", token, user: userData });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.post("/send-otp", async (req, res) => {
    const { phone } = req.body;
    try {
        if (!phone) return res.status(400).json({ message: "Phone number is required" });

        const user = await User.findOne({ phone });
        if (!user) return res.status(400).json({ message: "User not found" });

        // Generate OTP using Twilio
        const otpResponse = await client.verify.v2.services(process.env.TWILIO_SERVICE_SID)
            .verifications.create({ to: phone, channel: "sms" });

        res.json({ message: "OTP sent successfully", sid: otpResponse.sid });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// **VERIFY OTP**
router.post("/verify-otp", async (req, res) => {
    const { phone, otp } = req.body;
    try {
        if (!phone || !otp) return res.status(400).json({ message: "Phone and OTP are required" });

        const verificationCheck = await client.verify.v2.services(process.env.TWILIO_SERVICE_SID)
            .verificationChecks.create({ to: phone, code: otp });

        if (verificationCheck.status !== "approved") {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        let user = await User.findOne({ phone });

        const token = jwt.sign({ userId: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRY });

        const userData = user.toObject();
        delete userData.password;

        res.json({ 'msg': "Login Successfull", token, user: userData });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;