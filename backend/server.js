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
  origin: 'https://honduras-archive-1.onrender.com', // Your STATIC site URL
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

// 4 & 7. CONNECT FIRST, THEN START SERVER
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 45000 // Give it 45 seconds to wake up
}) 
.then(() => {
  console.log("✅ Connected to MongoDB Atlas");
  const PORT = process.env.PORT || 10000; 
  app.listen(PORT, () => { 
    console.log(`🚀 Server is LIVE on port ${PORT}`); 
  });
}) 
.catch(err => {
  console.error("❌ MongoDB Connection Error:", err.message);
  process.exit(1); // Stop if the connection fails
});