const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');

dotenv.config();
const app = express();

// 1. Middleware (Must come BEFORE routes)
app.use(express.json());
app.use(cors());

// 2. Auth Routes (Handles /api/auth/signup and /api/auth/login)
app.use('/api/auth', authRoutes);

// 3. Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// 4. Archive Schema & Model
const archiveSchema = new mongoose.Schema({ 
  title: String, 
  description: String, 
  date: String, 
  category: String,
  imageUrl: String // Added this just in case you plan to upload images
}, { timestamps: true });

const ArchiveItem = mongoose.model('ArchiveItem', archiveSchema);

// 5. Archive Routes
app.post('/api/archive', async (req, res) => { 
  try { 
    const newItem = new ArchiveItem(req.body);
    await newItem.save(); 
    res.status(201).json({ success: true, message: "Item saved to Honduras Archive!" }); 
  } catch (err) { 
    res.status(500).json({ success: false, error: err.message }); 
  } 
});

// 6. Start Server on 5500
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`🚀 Server spinning on http://localhost:${PORT}`);
});