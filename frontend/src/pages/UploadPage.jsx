import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UploadPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    eventDate: '',
    location: '',
    category: 'News',
    recordType: '',
    transcription: '',
    newspaperName: '', // NEW: Newspaper/Magazine name
    pdfName: '',
    pageNumber: '',
    pdfLink: ''
  });
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      if (userData.role === 'admin') {
        setUser(userData);
      } else {
        alert('Access denied. Only administrators can upload records.');
        navigate('/');
      }
    } else {
      alert('Please log in as administrator to upload records.');
      navigate('/login');
    }
  }, [navigate]);

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setImageFile(selectedFile);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'category') {
      if (['Birth News', 'Death News', 'Marriage News'].includes(value)) {
        setFormData(prev => ({
          ...prev,
          category: value,
          recordType: value
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!imageFile) {
      alert('Please select an image of the newspaper clipping/portrait');
      return;
    }

    setUploading(true);

    try {
      // Prepare names array
      const namesArray = formData.fullName.split(',').map(name => name.trim());

      // Prepare FormData for multipart upload
      const data = new FormData();
      data.append('image', imageFile);
      data.append('names', JSON.stringify(namesArray));
      data.append('eventDate', formData.eventDate);
      data.append('location', formData.location);
      data.append('category', formData.category);
      data.append('recordType', formData.recordType || formData.category);
      data.append('transcription', formData.transcription);
      data.append('newspaperName', formData.newspaperName); // NEW
      data.append('pdfName', formData.pdfName);
      data.append('pageNumber', formData.pageNumber);
      data.append('pdfLink', formData.pdfLink);

      // Send to backend
      await axios.post('https://honduras-archive.onrender.com/api/archive', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccess(true);
      
      // Reset form
      setFormData({
        fullName: '',
        eventDate: '',
        location: '',
        category: 'News',
        recordType: '',
        transcription: '',
        newspaperName: '',
        pdfName: '',
        pageNumber: '',
        pdfLink: ''
      });
      setImageFile(null);
      setImagePreview(null);
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return (
      <div style={{ backgroundColor: '#EFE7DD', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ fontSize: '1.2rem', color: '#737958' }}>Checking permissions...</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#EFE7DD', minHeight: '100vh', padding: '40px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ color: '#737958', marginBottom: '10px', fontSize: '2rem' }}>Add Record to Archive</h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>Logged in as: <strong>{user.username}</strong> (Admin)</p>

        {success && (
          <div style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '15px', borderRadius: '8px', marginBottom: '25px', textAlign: 'center' }}>
            ✓ Record added successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '35px', borderRadius: '12px', border: '2px solid #737958' }}>
          
          {/* Image Upload */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', color: '#737958', marginBottom: '10px', fontWeight: 'bold' }}>Upload Clipping/Portrait Image *</label>
            {imagePreview && <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px', marginBottom: '15px', borderRadius: '8px' }} />}
            <input type="file" accept="image/*" required onChange={handleImageChange} style={{ width: '100%', padding: '12px' }} />
          </div>

          {/* Full Name */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#737958', marginBottom: '8px', fontWeight: 'bold' }}>
              Full Name of Person(s) *
            </label>
            <input 
              type="text" 
              name="fullName" 
              required 
              value={formData.fullName} 
              onChange={handleChange} 
              placeholder="For multiple people, separate with commas: Juan Pérez, María López"
              style={{ width: '100%', padding: '12px', border: '2px solid #ddd', borderRadius: '6px' }} 
            />
            <small style={{ color: '#666', fontSize: '0.85rem' }}>
              For marriages or multiple people, separate names with commas
            </small>
          </div>

          {/* Category */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#737958', marginBottom: '8px', fontWeight: 'bold' }}>Category *</label>
            <select name="category" value={formData.category} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '2px solid #ddd', borderRadius: '6px' }}>
              <option value="News">News / Clipping</option>
              <option value="Portrait">Portrait / Photo</option>
              <option value="Birth">Birth News</option>
              <option value="Death">Death News</option>
              <option value="Marriage">Marriage News</option>
            </select>
          </div>

          {/* Date & Location */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#737958', marginBottom: '8px', fontWeight: 'bold' }}>Date *</label>
              <input type="text" name="eventDate" required value={formData.eventDate} onChange={handleChange} placeholder="e.g., 1945-06-15" style={{ width: '100%', padding: '12px', border: '2px solid #ddd', borderRadius: '6px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#737958', marginBottom: '8px', fontWeight: 'bold' }}>Location *</label>
              <input type="text" name="location" required value={formData.location} onChange={handleChange} placeholder="e.g., Tegucigalpa" style={{ width: '100%', padding: '12px', border: '2px solid #ddd', borderRadius: '6px' }} />
            </div>
          </div>

          {/* PDF Source */}
          <div style={{ backgroundColor: '#fff9e6', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            <h3 style={{ color: '#737958', marginTop: 0, marginBottom: '15px', fontSize: '1rem' }}>
              Source Information
            </h3>
            
            {/* NEW: Newspaper/Magazine Name */}
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Newspaper/Magazine Name</label>
            <input 
              type="text" 
              name="newspaperName" 
              value={formData.newspaperName} 
              onChange={handleChange} 
              placeholder="e.g., La Prensa, El Heraldo, Revista Tegucigalpa"
              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }} 
            />
            
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>PDF Filename</label>
            <input 
              type="text" 
              name="pdfName" 
              value={formData.pdfName} 
              onChange={handleChange} 
              placeholder="e.g., La_Prensa_1945_06.pdf"
              style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px' }} 
            />
            
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Page Number</label>
            <input 
              type="text" 
              name="pageNumber" 
              value={formData.pageNumber} 
              onChange={handleChange} 
              placeholder="e.g., 12"
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} 
            />
          </div>

          {/* Transcription */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', color: '#737958', marginBottom: '8px', fontWeight: 'bold' }}>Transcription</label>
            <textarea 
              name="transcription" 
              rows="6" 
              value={formData.transcription} 
              onChange={handleChange} 
              placeholder="Type the text from the newspaper clipping here..."
              style={{ width: '100%', padding: '12px', border: '2px solid #ddd', borderRadius: '6px' }} 
            />
          </div>

          <button type="submit" disabled={uploading} style={{ width: '100%', backgroundColor: uploading ? '#999' : '#737958', color: 'white', padding: '16px', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: uploading ? 'not-allowed' : 'pointer' }}>
            {uploading ? '⏳ Adding to Archive...' : '✅ Add to Archive'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadPage;