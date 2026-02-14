import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UploadPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  // Multiple names array
  const [names, setNames] = useState([{ fullName: '' }]);
  
  const [formData, setFormData] = useState({
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
  };

  // Handle name changes
  const handleNameChange = (index, value) => {
    const updatedNames = [...names];
    updatedNames[index].fullName = value;
    setNames(updatedNames);
  };

  // Add new name field
  const addNameField = () => {
    setNames([...names, { fullName: '' }]);
  };

  // Remove name field
  const removeNameField = (index) => {
    if (names.length > 1) {
      const updatedNames = names.filter((_, i) => i !== index);
      setNames(updatedNames);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!imageFile) {
      alert('Please select an image of the newspaper clipping/portrait');
      return;
    }

    // Validate at least one name is provided
    const validNames = names.filter(n => n.fullName.trim() !== '');
    if (validNames.length === 0) {
      alert('Please provide at least one name');
      return;
    }

    setUploading(true);

    try {
      // Prepare names array
      const namesArray = validNames.map(n => n.fullName.trim());

      // Prepare FormData for multipart upload
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

      // Send to backend
      await axios.post('https://honduras-archive.onrender.com/api/archive', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccess(true);
      
      // Reset form
      setFormData({
        eventDate: '',
        location: '',
        category: 'News',
        recordType: '',
        transcription: '',
        pdfName: '',
        pageNumber: '',
        pdfLink: ''
      });
      setNames([{ fullName: '' }]);
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
          <div style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '15px', borderRadius: '8px', marginBottom: '25px', textAlign: 'center', fontWeight: 'bold' }}>
            ✓ Record added successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '35px', borderRadius: '12px', border: '2px solid #737958' }}>
          
          {/* Image Upload */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', color: '#737958', marginBottom: '10px', fontWeight: 'bold', fontSize: '1.05rem' }}>
              📷 Upload Clipping/Portrait Image *
            </label>
            {imagePreview && (
              <img 
                src={imagePreview} 
                alt="Preview" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '300px', 
                  marginBottom: '15px', 
                  borderRadius: '8px',
                  border: '2px solid #ddd'
                }} 
              />
            )}
            <input 
              type="file" 
              accept="image/*" 
              required 
              onChange={handleImageChange} 
              style={{ 
                width: '100%', 
                padding: '12px',
                border: '2px solid #ddd',
                borderRadius: '6px'
              }} 
            />
          </div>

          {/* Names Section */}
          <div style={{ 
            marginBottom: '25px', 
            padding: '20px', 
            backgroundColor: '#f5f5f5', 
            borderRadius: '8px' 
          }}>
            <label style={{ 
              display: 'block', 
              color: '#737958', 
              marginBottom: '15px', 
              fontWeight: 'bold', 
              fontSize: '1.05rem' 
            }}>
              👤 Person Names *
            </label>
            
            {names.map((name, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                gap: '10px', 
                marginBottom: '12px',
                alignItems: 'center'
              }}>
                <input
                  type="text"
                  value={name.fullName}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  placeholder={`Person ${index + 1} Full Name`}
                  required={index === 0}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: '2px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '1rem'
                  }}
                />
                {names.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeNameField(index)}
                    style={{
                      backgroundColor: '#d32f2f',
                      color: 'white',
                      border: 'none',
                      padding: '12px 16px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            
            <button
              type="button"
              onClick={addNameField}
              style={{
                backgroundColor: '#4caf50',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                marginTop: '10px'
              }}
            >
              ➕ Add Another Person
            </button>
            <p style={{ 
              fontSize: '0.85rem', 
              color: '#666', 
              marginTop: '10px',
              fontStyle: 'italic'
            }}>
              For marriages, births with parents, or group photos - add multiple names
            </p>
          </div>

          {/* Category */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#737958', marginBottom: '8px', fontWeight: 'bold' }}>
              📁 Category *
            </label>
            <select 
              name="category" 
              value={formData.category} 
              onChange={handleChange} 
              style={{ 
                width: '100%', 
                padding: '12px', 
                border: '2px solid #ddd', 
                borderRadius: '6px',
                fontSize: '1rem'
              }}
            >
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
              <label style={{ display: 'block', color: '#737958', marginBottom: '8px', fontWeight: 'bold' }}>
                📅 Date *
              </label>
              <input 
                type="text" 
                name="eventDate" 
                required 
                value={formData.eventDate} 
                onChange={handleChange} 
                placeholder="e.g., 1945-06-15 or June 1945"
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '2px solid #ddd', 
                  borderRadius: '6px' 
                }} 
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#737958', marginBottom: '8px', fontWeight: 'bold' }}>
                📍 Location *
              </label>
              <input 
                type="text" 
                name="location" 
                required 
                value={formData.location} 
                onChange={handleChange} 
                placeholder="e.g., Tegucigalpa, Honduras"
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '2px solid #ddd', 
                  borderRadius: '6px' 
                }} 
              />
            </div>
          </div>

          {/* PDF Source */}
          <div style={{ 
            backgroundColor: '#fff9e6', 
            padding: '20px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            border: '1px solid #f0e68c'
          }}>
            <h3 style={{ 
              color: '#737958', 
              marginBottom: '15px',
              fontSize: '1rem'
            }}>
              📄 Source Information (Optional)
            </h3>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#666' }}>
              PDF Filename
            </label>
            <input 
              type="text" 
              name="pdfName" 
              value={formData.pdfName} 
              onChange={handleChange} 
              placeholder="e.g., La_Prensa_1945_06.pdf"
              style={{ 
                width: '100%', 
                padding: '10px', 
                marginBottom: '15px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }} 
            />
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#666' }}>
              Page Number
            </label>
            <input 
              type="text" 
              name="pageNumber" 
              value={formData.pageNumber} 
              onChange={handleChange} 
              placeholder="e.g., 12"
              style={{ 
                width: '100%', 
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }} 
            />
          </div>

          {/* Transcription */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', color: '#737958', marginBottom: '8px', fontWeight: 'bold' }}>
              📝 Transcription (Optional)
            </label>
            <textarea 
              name="transcription" 
              rows="6" 
              value={formData.transcription} 
              onChange={handleChange} 
              placeholder="Type the text from the newspaper clipping here..."
              style={{ 
                width: '100%', 
                padding: '12px', 
                border: '2px solid #ddd', 
                borderRadius: '6px',
                fontSize: '1rem',
                fontFamily: 'inherit'
              }} 
            />
          </div>

          <button 
            type="submit" 
            disabled={uploading} 
            style={{ 
              width: '100%', 
              backgroundColor: uploading ? '#999' : '#737958', 
              color: 'white', 
              padding: '16px', 
              borderRadius: '8px', 
              fontWeight: 'bold', 
              border: 'none',
              fontSize: '1.1rem',
              cursor: uploading ? 'not-allowed' : 'pointer'
            }}
          >
            {uploading ? '⏳ Adding to Archive...' : '✅ Add to Archive'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadPage;