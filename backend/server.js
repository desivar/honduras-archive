const express = require('express'); 
const mongoose = require('mongoose'); 
const cors = require('cors'); 
const dotenv = require('dotenv'); 
const multer = require('multer'); 
const { CloudinaryStorage } = require('multer-storage-cloudinary'); 
const cloudinary = require('cloudinary').v2; 
const authRoutes = require('./routes/authRoutes');

// 1. CONFIGURATION
dotenv.config(); 
const app = express();

// 2. MIDDLEWARE
app.use(express.json());
app.use(cors({
  origin: 'https://honduras-archive.onrender.com', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// 3. CLOUDINARY CONFIG
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const storage = new CloudinaryStorage({ 
  cloudinary: cloudinary,
  params: { 
    folder: 'honduras_archive', 
    allowed_formats: ['jpg', 'png', 'jpeg'] 
  }, 
}); 
const upload = multer({ storage: storage });

// 4. DATABASE CONNECTION 
mongoose.connect(process.env.MONGO_URI) 
  .then(() => console.log("✅ Connected to MongoDB Atlas")) 
  .catch(err => console.error("❌ MongoDB Connection Error:", err.message));

// 5. SCHEMAS & MODELS
const archiveSchema = new mongoose.Schema({ 
  names: [String], 
  eventDate: String, 
  location: String,
  category: String, 
  transcription: String, 
  imageUrl: String, 
  pdfName: String,
  pageNumber: String, 
  userId: String 
}, { timestamps: true });

const ArchiveItem = mongoose.model('ArchiveItem', archiveSchema);

// 6. ROUTES
// Root Route 
app.get('/', (req, res) => { 
  res.send('Honduras Archive Backend is online!'); 
});

// Auth Routes (Login)
app.use('/api/auth', authRoutes);

// Archive Upload Route
app.post('/api/archive', upload.single('image'), async (req, res) => { 
  try { 
    const namesArray = JSON.parse(req.body.names); 
    const newItem = new ArchiveItem({ 
      names: namesArray, 
      eventDate: req.body.eventDate,
      location: req.body.location, 
      category: req.body.category, 
      transcription: req.body.transcription, 
      pdfName: req.body.pdfName, 
      pageNumber: req.body.pageNumber, 
      userId: req.body.userId, 
      imageUrl: req.file ? req.file.path : '' 
    }); 
    await newItem.save(); 
    res.status(201).json({ success: true, message: "Item saved!" });
  } catch (err) { 
    console.error("Upload Error:", err); 
    res.status(500).json({ success: false, error: err.message }); 
  } 
});
// ADD THESE NEW ROUTES HERE ⬇️

// Get all archive items
app.get('/api/archive', async (req, res) => {
  try {
    const items = await ArchiveItem.find().sort({ createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Search archive items
app.get('/api/archive/search', async (req, res) => {
  try {
    const { query } = req.query;
    const items = await ArchiveItem.find({
      $or: [
        { names: { $regex: query, $options: 'i' } },
        { location: { $regex: query, $options: 'i' } },
        { transcription: { $regex: query, $options: 'i' } }
         ]
    });
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. START SERVER (Always at the very bottom)
const PORT = process.env.PORT || 10000; 
app.listen(PORT, () => { 
  console.log(`🚀 Server is LIVE on port ${PORT}`);
});