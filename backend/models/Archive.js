const mongoose = require('mongoose');

const archiveSchema = new mongoose.Schema({
  names: { type: String, required: true },
  countryOfOrigin: { type: String, default: 'Honduras' }, // 🌍 Added for your international news
  newspaperName: String,
  dateOfPublication: String,
  pageNumber: String,
  transcription: String,
  imageUrl: String,
  familySearchId: String, // 💡 Great for your volunteer work!
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Archive', archiveSchema);