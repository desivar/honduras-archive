const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// SIGN UP - Updated to include role and whatsapp
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, role, whatsapp } = req.body; // Add fields here
    
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save with the role (default to 'visitor' if not provided)
    user = new User({ 
      username, 
      email, 
      password: hashedPassword, 
      role: role || 'visitor', 
      whatsapp 
    });
    
    await user.save();
    res.status(201).json({ message: "User created!" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});