const express = require('express'); 
const mongoose = require('mongoose'); 
const cors = require('cors'); 
//const dotenv = require('dotenv'); 
const multer = require('multer'); 
const { CloudinaryStorage } = require('multer-storage-cloudinary'); 
const cloudinary = require('cloudinary').v2; 
const authRoutes = require('./routes/authRoutes');

// 1. CONFIGURATION
//dotenv.config(); 
const app = express();


// 🔍 TEMPORARY DEBUG
console.log('🔍 Checking MONGO_URI...');
console.log('First 50 chars:', process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 50) : 'UNDEFINED');
console.log('Contains username:', process.env.MONGO_URI ? process.env.MONGO_URI.includes('jilliandesire') : 'NO');
console.log('Contains database:', process.env.MONGO_URI ? process.env.MONGO_URI.includes('honduras_archive') : 'NO');

// 2. MIDDLEWARE
app.use(express.json());
app.use(cors({
  origin: 'https://honduras-archive-1.onrender.com', //frontend
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

// 4. DATABASE CONNECTION
// Change 'testUri' to 'process.env.MONGO_URI'
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 30000,
  bufferCommands: false // Stops the 10-second "ghost" timeout
}) 
.then(() => {
  console.log("✅ Connected to MongoDB Atlas");

  // 6. ROUTES (Move your routes inside the .then block)
  app.use('/api/auth', authRoutes);

  app.get('/', (req, res) => res.send('Honduras Archive Backend is online!'));

  app.post('/api/archive', upload.single('image'), async (req, res) => {
      // ... your existing upload logic ...
  });

  app.get('/api/archive', async (req, res) => {
      // ... your existing get logic ...
  });

  // 7. START SERVER (Only after DB is ready)
  const PORT = process.env.PORT || 10000; 
  app.listen(PORT, () => { 
    console.log(`🚀 Server is LIVE on port ${PORT}`);
  });
}) 
.catch(err => {
  console.error("❌ MongoDB Connection Error:", err.message);
  // This will tell us if it's a password (Bad Auth) or an IP block
});