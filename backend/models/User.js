const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // 🟢 Added whatsapp field here!
  whatsapp: { type: String }, 
  role: { 
    type: String, 
    enum: ['admin', 'client', 'visitor'], // 🟢 Added 'visitor' to match your authRoutes
    default: 'visitor' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);