const express = require('express'); 
const mongoose = require('mongoose'); 
const cors = require('cors'); 
const multer = require('multer'); 
const { CloudinaryStorage } = require('multer-storage-cloudinary'); 
const cloudinary = require('cloudinary').v2; 
const authRoutes = require('./routes/authRoutes');

// 1. CONFIGURATION
const app = express();

// 🔍 ENHANCED DEBUGGING FOR MONGO_URI
console.log('🔍 ENVIRONMENT VARIABLES CHECK:');
console.log('MONGO_URI present:', !!process.env.MONGO_URI);
if (process.env.MONGO_URI) {
  // Log the URI structure without exposing credentials
  const uriParts = process.env.MONGO_URI.split('@');
  if (uriParts.length > 1) {
    console.log('URI Format: [credentials hidden]@' + uriParts[1]);
    console.log('Contains username:', process.env.MONGO_URI.includes('jilliandesire'));
    console.log('Contains database:', process.env.MONGO_URI.includes('honduras_archive'));
  } else {
    console.log('URI Format unexpected - no @ symbol found');
  }
} else {
  console.error('❌ MONGO_URI is not defined in environment variables!');
}

// 2. MIDDLEWARE
app.use(express.json());
app.use(cors({
  origin: ['https://honduras-archive-1.onrender.com', 'http://localhost:3000'], // Add local for development
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// 3. CLOUDINARY CONFIG
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('❌ Missing Cloudinary configuration');
} else {
  cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
  });
  console.log('✅ Cloudinary configured');
}

const storage = new CloudinaryStorage({ 
  cloudinary: cloudinary,
  params: { 
    folder: 'honduras_archive', 
    allowed_formats: ['jpg', 'png', 'jpeg'] 
  }, 
}); 
const upload = multer({ storage: storage });

// 4. DATABASE CONNECTION FUNCTION
async function connectToDatabase() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI environment variable is not defined');
  }

  console.log('🔄 Attempting to connect to MongoDB Atlas...');
  
  // Connection options optimized for Atlas
  const options = {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000,
    maxPoolSize: 10,
    minPoolSize: 2,
    retryWrites: true,
    retryReads: true,
    bufferCommands: false, // Stops the 10-second "ghost" timeout
    autoIndex: true, // Build indexes
    maxIdleTimeMS: 10000,
    waitQueueTimeoutMS: 10000
  };

  // Add special handling for SRV records (Atlas uses these)
  if (process.env.MONGO_URI.includes('.mongodb.net')) {
    console.log('✅ Atlas URI detected');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, options);
    console.log("✅ Successfully connected to MongoDB Atlas");
    
    // Verify connection
    const dbStatus = mongoose.connection.readyState;
    const statusMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    console.log(`📊 Connection state: ${statusMap[dbStatus]}`);
    
    return true;
  } catch (error) {
    console.error("❌ MongoDB Connection Error Details:");
    console.error(`  - Name: ${error.name}`);
    console.error(`  - Message: ${error.message}`);
    
    // Specific error handling
    if (error.name === 'MongoServerError') {
      if (error.code === 18 || error.message.includes('Authentication failed')) {
        console.error('  🔐 AUTHENTICATION ERROR: Check username and password');
      } else if (error.code === 13) {
        console.error('  🔐 UNAUTHORIZED: Database user permissions issue');
      } else if (error.code === 8000) {
        console.error('  🔐 Atlas-specific authentication failure');
      }
    } else if (error.name === 'MongooseServerSelectionError') {
      console.error('  🌐 NETWORK ERROR: Cannot reach MongoDB servers');
      console.error('  💡 Check:');
      console.error('    1. Network connectivity to MongoDB Atlas');
      console.error('    2. IP whitelist (add 0.0.0.0/0 for testing)');
      console.error('    3. Atlas cluster status (is it paused?)');
    }
    
    throw error; // Re-throw to handle in main flow
  }
}

// 5. ROUTES SETUP (Define routes before server start)
function setupRoutes(app) {
  console.log('🔄 Setting up routes...');
  
  // Auth routes
  app.use('/api/auth', authRoutes);
  
  // Health check endpoint
  app.get('/health', (req, res) => {
    const dbState = mongoose.connection.readyState;
    const dbStatus = ['disconnected', 'connected', 'connecting', 'disconnecting'][dbState] || 'unknown';
    
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: {
        state: dbState,
        status: dbStatus,
        name: mongoose.connection.name || 'unknown'
      }
    });
  });

  app.get('/', (req, res) => {
    const dbState = mongoose.connection.readyState;
    const isConnected = dbState === 1;
    
    res.send(`
      <h1>Honduras Archive Backend</h1>
      <p>Status: ${isConnected ? '✅ Online' : '⚠️ Database connecting...'}</p>
      <p>Database: ${isConnected ? 'Connected to MongoDB Atlas' : 'Waiting for connection...'}</p>
      <p><a href="/health">Health Check</a></p>
    `);
  });

  // Archive endpoints
  app.post('/api/archive', upload.single('image'), async (req, res) => {
    try {
      // Your upload logic here
      if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' });
      }
      
      res.json({ 
        message: 'Upload successful',
        file: req.file 
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/archive', async (req, res) => {
    try {
      // Your get logic here
      res.json({ message: 'Archive endpoint working' });
    } catch (error) {
      console.error('Fetch error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  console.log('✅ Routes setup complete');
}

// 6. START SERVER FUNCTION
async function startServer() {
  try {
    // Setup routes first (they'll work once DB connects)
    setupRoutes(app);
    
    // Attempt database connection
    await connectToDatabase();
    
    // Start listening only after successful DB connection
    const PORT = process.env.PORT || 10000;
    const server = app.listen(PORT, () => { 
      console.log(`🚀 Server is LIVE on port ${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 Frontend URL: https://honduras-archive-1.onrender.com`);
    });

    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, closing gracefully...');
      server.close(() => {
        mongoose.connection.close(false).then(() => {
          console.log('MongoDB connection closed');
          process.exit(0);
        });
      });
    });

    return server;
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    
    // Don't exit in production - let Render restart
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
    
    // In production, keep trying to reconnect
    console.log('🔄 Will attempt to reconnect in 10 seconds...');
    setTimeout(startServer, 10000);
  }
}

// 7. HANDLE MONGOOSE CONNECTION EVENTS
mongoose.connection.on('connected', () => {
  console.log('🔌 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('🔌 Mongoose connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose disconnected from MongoDB');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔌 Mongoose reconnected to MongoDB');
});

// 8. INITIALIZE SERVER
console.log('🚀 Starting Honduras Archive Backend...');
startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit, just log
});