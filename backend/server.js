const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const archiveSchema = new mongoose.Schema({ title: String, description: String, date: String, category: String });

const ArchiveItem = mongoose.model('ArchiveItem', archiveSchema);
app.use(express.json());

app.post('/api/archive', async (req, res) =>
   { try { const newItem = new ArchiveItem(req.body);
     await newItem.save(); res.status(201).json({ message: "Item saved to Honduras Archive!" }); 
    } catch (err) { res.status(500).json({ error: err.message }); } });