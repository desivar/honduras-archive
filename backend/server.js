const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const authRoutes = require('./routes/authRoutes');

dotenv.config();
const app = express();

// 1. Cloudinary Config
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

// 2. Middleware
app.use(express.json());
app.use(cors());

// 3. Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// 4. Schema (Handles your Spanish accents correctly)
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

// 5. THE MISSING ARCHIVE ROUTE (This fixes the 404!)
app.post('/api/archive', upload.single('image'), async (req, res) => { 
  try { 
    // This correctly handles the special characters you typed
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

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`🚀 Server spinning on http://localhost:${PORT}`);
});