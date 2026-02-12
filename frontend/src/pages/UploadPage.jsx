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
      // 1. Prepare names array
      const namesArray = formData.fullName.split(',').map(name => name.trim());

      // 2. Prepare FormData for multipart upload
      const data = new FormData();
      data.append('image', imageFile);
      data.append('names', JSON.stringify(namesArray));
      data.append('eventDate', formData.eventDate);
      data.append('location', formData.location);
      data.append('category', formData.category);
      data.append('recordType', formData.recordType || formData.category);
      data.append('transcription', formData.transcription);
      data.append('pdfName', formData.pdfName);
      data.append('pageNumber', formData.pageNumber);
      data.append('pdfLink', formData.pdfLink);
      data.append('userId', user.userId);

      // 3. Send to Render Backend
      await axios.post(`${import.meta.env.VITE_API_URL}/api/archive`, data, {
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
            <label style={{ display: 'block', color: '#737958', marginBottom: '8px', fontWeight: 'bold' }}>Full Name of Person *</label>
            <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '2px solid #ddd', borderRadius: '6px' }} />
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
              <input type="text" name="eventDate" required value={formData.eventDate} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '2px solid #ddd', borderRadius: '6px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#737958', marginBottom: '8px', fontWeight: 'bold' }}>Location *</label>
              <input type="text" name="location" required value={formData.location} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '2px solid #ddd', borderRadius: '6px' }} />
            </div>
          </div>

          {/* PDF Source */}
          <div style={{ backgroundColor: '#fff9e6', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>PDF Filename</label>
            <input type="text" name="pdfName" value={formData.pdfName} onChange={handleChange} style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Page Number</label>
            <input type="text" name="pageNumber" value={formData.pageNumber} onChange={handleChange} style={{ width: '100%', padding: '10px' }} />
          </div>

          {/* Transcription */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', color: '#737958', marginBottom: '8px', fontWeight: 'bold' }}>Transcription</label>
            <textarea name="transcription" rows="6" value={formData.transcription} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '2px solid #ddd', borderRadius: '6px' }} />
          </div>

          <button type="submit" disabled={uploading} style={{ width: '100%', backgroundColor: uploading ? '#999' : '#737958', color: 'white', padding: '16px', borderRadius: '8px', fontWeight: 'bold', border: 'none' }}>
            {uploading ? '⏳ Adding to Archive...' : '✅ Add to Archive'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadPage;