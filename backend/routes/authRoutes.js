const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// 1. SIGNUP: Auto-assigns 'admin' to the very first user
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, whatsapp } = req.body;
    
    // Check if this is the first user ever
    const userCount = await User.countDocuments({});
    const assignedRole = (userCount === 0) ? 'admin' : 'visitor';

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ success: false, message: "User exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ 
      username, 
      email, 
      password: hashedPassword, 
      role: assignedRole, 
      whatsapp 
    });
    
    await user.save();
    res.status(201).json({ success: true, message: `Account created as ${assignedRole}!` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. LOGIN: Validates normal password against the long hash
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid password" });

    res.json({ 
      success: true, 
      message: `Welcome back, ${user.username}!`,
      user: { username: user.username, role: user.role } 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Login error" });
  }
});

// 3. ADMIN ONLY: Update another user's role or password
router.put('/update-user/:id', async (req, res) => {
  try {
    const { role, password } = req.body;
    let updateData = {};

    if (role) updateData.role = role;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ success: true, message: "User updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ success: false, message: "Update failed" });
  }
});

module.exports = router;