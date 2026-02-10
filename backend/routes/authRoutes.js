const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// SIGNUP - With "First User = Admin" logic
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, whatsapp } = req.body;
    
    // 🟢 DETAIL 1: Check how many users exist
    const userCount = await User.countDocuments({});
    // If count is 0, make them 'admin', otherwise 'visitor'
    const assignedRole = (userCount === 0) ? 'admin' : 'visitor';

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ 
      username, 
      email, 
      password: hashedPassword, 
      role: assignedRole, // 🟢 DETAIL 2: Use the assignedRole variable here
      whatsapp 
    });
    
    await user.save();
    
    // 🟢 DETAIL 3: Sending 'success: true' triggers the Welcome alert in the frontend
    res.status(201).json({ 
      success: true, 
      message: `Welcome! Account created as ${assignedRole}` 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// LOGIN - This is why your Sign In currently fails
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) return res.status(400).json({ success: false, message: "User not found" });

    // 🟢 DETAIL 4: Verify the simple password against the long hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid password" });

    res.json({ 
      success: true, 
      message: "Logged in!", 
      user: { username: user.username, role: user.role } 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;