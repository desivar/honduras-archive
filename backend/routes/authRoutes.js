const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 1. SIGN UP
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, role, whatsapp } = req.body;
    
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ success: false, message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ 
      username, 
      email, 
      password: hashedPassword, 
      role: role || 'visitor', 
      whatsapp 
    });
    
    await user.save();
    res.status(201).json({ success: true, message: "User created!" });
  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. LOGIN (Add this part!)
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid username or password" });
    }

    // Compare plain-text password with the hash in MongoDB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid username or password" });
    }

    // Login Success
    res.json({ 
      success: true, 
      message: "Logged in successfully!",
      user: { username: user.username, role: user.role } 
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router; // 🟢 DON'T FORGET THIS LINE!