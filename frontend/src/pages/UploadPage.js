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
        setFormData({
          ...formData,
          category: value,
          recordType: value
        });
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

    const data = new FormData();
    data.append('image', imageFile);
    data.append('fullName', formData.fullName);
    data.append('eventDate', formData.eventDate);
    data.append('location', formData.location);
    data.append('category', formData.category);
    data.append('recordType', formData.recordType || formData.category);
    data.append('transcription', formData.transcription);
    data.append('pdfName', formData.pdfName);
    data.append('pageNumber', formData.pageNumber);
    data.append('pdfLink', formData.pdfLink);
    data.append('userId', user.userId);

    try {
    await axios.post('/api/upload-snippet', data, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
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
      <div style={{ 
        backgroundColor: '#EFE7DD', 
        minHeight: '100vh', 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <p style={{ fontSize: '1.2rem', color: '#737958' }}>Checking permissions...</p>
      </div>
    );
  }

  return (
    <div style={{ 
      backgroundColor: '#EFE7DD', 
      minHeight: '100vh', 
      padding: '40px' 
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ 
          color: '#737958',
          marginBottom: '10px',
          fontSize: '2rem'
        }}>
          Add Record to Archive
        </h1>
        
        <p style={{ 
          color: '#666', 
          marginBottom: '30px',
          fontSize: '1rem',
          lineHeight: '1.6'
        }}>
          Logged in as: <strong>{user.username}</strong> (Admin)
          <br />
          Upload an image of a specific newspaper clipping/portrait and provide details.
        </p>

        {success && (
          <div style={{
            backgroundColor: '#e8f5e9',
            color: '#2e7d32',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '25px',
            textAlign: 'center',
            fontSize: '1.05rem',
            fontWeight: 'bold'
          }}>
            ✓ Record added successfully! You can add another one.
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ 
          backgroundColor: 'white',
          padding: '35px',
          borderRadius: '12px',
          border: '2px solid #737958'
        }}>
          
          {/* INSTRUCTIONS BOX */}
          <div style={{
            backgroundColor: '#f0f7ff',
            border: '2px solid #2196F3',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '30px'
          }}>
            <h3 style={{ color: '#2196F3', marginTop: 0, fontSize: '1.1rem' }}>
              📝 How to Add a Record:
            </h3>
            <ol style={{ color: '#555', fontSize: '0.95rem', lineHeight: '1.8', marginBottom: 0 }}>
              <li>Take a screenshot or crop the specific section from your PDF (portrait, news, vital record)</li>
              <li>Upload that image below</li>
              <li>Fill in all the details (name, date, location, etc.)</li>
              <li>Add PDF source info (filename and page number) so users can find the original</li>
              <li>Click "Add to Archive" - You can add multiple records from the same PDF!</li>
            </ol>
          </div>

          {/* Image Upload */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              color: '#737958',
              marginBottom: '10px',
              fontWeight: 'bold',
              fontSize: '1rem'
            }}>
              Upload Clipping/Portrait Image *
            </label>
            
            {imagePreview && (
              <div style={{ 
                marginBottom: '15px',
                textAlign: 'center',
                backgroundColor: '#f5f5f5',
                padding: '15px',
                borderRadius: '8px'
              }}>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{ 
                    maxWidth: '100%',
                    maxHeight: '400px',
                    borderRadius: '8px',
                    border: '2px solid #ddd'
                  }} 
                />
              </div>
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
                borderRadius: '6px',
                fontSize: '1rem',
                cursor: 'pointer',
                backgroundColor: '#f9f9f9'
              }}
            />
            <small style={{ color: '#666', fontSize: '0.85rem', display: 'block', marginTop: '5px' }}>
              Upload a clear image of the newspaper clipping, portrait, or vital record
            </small>
          </div>

          {/* Full Name */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: '#737958',
              marginBottom: '8px',
              fontWeight: 'bold',
              fontSize: '0.95rem'
            }}>
              Full Name of Person *
            </label>
            <input 
              type="text"
              name="fullName"
              placeholder="e.g., María Elena Soto García" 
              required 
              value={formData.fullName}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #ddd',
                borderRadius: '6px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
            <small style={{ color: '#666', fontSize: '0.85rem', display: 'block', marginTop: '5px' }}>
              This is what users will search for
            </small>
          </div>

          {/* Category */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: '#737958',
              marginBottom: '8px',
              fontWeight: 'bold',
              fontSize: '0.95rem'
            }}>
              Category *
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
                fontSize: '1rem',
                boxSizing: 'border-box',
                cursor: 'pointer',
                backgroundColor: 'white'
              }}
            >
              <option value="News">News / Clipping</option>
              <option value="Portrait">Portrait / Photo</option>
              <option value="Birth">Birth Record (DOB)</option>
              <option value="Death">Death Record (DOD)</option>
              <option value="Marriage">Marriage Certificate</option>
            </select>
          </div>

          {/* Date */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: '#737958',
              marginBottom: '8px',
              fontWeight: 'bold',
              fontSize: '0.95rem'
            }}>
              Date (Year or Full Date) *
            </label>
            <input 
              type="text"
              name="eventDate"
              placeholder="e.g., 1950 or 15 de marzo 1950" 
              required 
              value={formData.eventDate}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #ddd',
                borderRadius: '6px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Location */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: '#737958',
              marginBottom: '8px',
              fontWeight: 'bold',
              fontSize: '0.95rem'
            }}>
              Location (City, Department) *
            </label>
            <input 
              type="text"
              name="location"
              placeholder="e.g., Tegucigalpa, Francisco Morazán" 
              required 
              value={formData.location}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #ddd',
                borderRadius: '6px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* PDF SOURCE INFORMATION */}
          <div style={{
            backgroundColor: '#fff9e6',
            border: '2px solid #f4c430',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <h3 style={{ color: '#737958', marginTop: 0, fontSize: '1rem', marginBottom: '15px' }}>
              📄 PDF Source Information
            </h3>

            <div style={{ marginBottom: '15px' }}>
              <label style={{
                display: 'block',
                color: '#737958',
                marginBottom: '8px',
                fontWeight: 'bold',
                fontSize: '0.9rem'
              }}>
                PDF Filename
              </label>
              <input 
                type="text"
                name="pdfName"
                placeholder="e.g., La Prensa 1950-03-15.pdf" 
                value={formData.pdfName}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '0.95rem',
                  boxSizing: 'border-box'
                }}
              />
              <small style={{ color: '#666', fontSize: '0.8rem', display: 'block', marginTop: '5px' }}>
                Name of the PDF file in your uploads folder
              </small>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{
                display: 'block',
                color: '#737958',
                marginBottom: '8px',
                fontWeight: 'bold',
                fontSize: '0.9rem'
              }}>
                Page Number
              </label>
              <input 
                type="text"
                name="pageNumber"
                placeholder="e.g., 12 or pages 12-13" 
                value={formData.pageNumber}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '0.95rem',
                  boxSizing: 'border-box'
                }}
              />
              <small style={{ color: '#666', fontSize: '0.8rem', display: 'block', marginTop: '5px' }}>
                Which page(s) in the PDF contains this information
              </small>
            </div>

            <div>
              <label style={{
                display: 'block',
                color: '#737958',
                marginBottom: '8px',
                fontWeight: 'bold',
                fontSize: '0.9rem'
              }}>
                PDF Link (optional)
              </label>
              <input 
                type="url"
                name="pdfLink"
                placeholder="https://yoursite.com/uploads/newspaper-1950.pdf" 
                value={formData.pdfLink}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '0.95rem',
                  boxSizing: 'border-box'
                }}
              />
              <small style={{ color: '#666', fontSize: '0.8rem', display: 'block', marginTop: '5px' }}>
                Direct link to view the full PDF (if hosted online)
              </small>
            </div>
          </div>

          {/* Transcription */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              color: '#737958',
              marginBottom: '8px',
              fontWeight: 'bold',
              fontSize: '0.95rem'
            }}>
              Transcription
            </label>
            <textarea 
              name="transcription"
              placeholder="Type or paste the text content from the newspaper clipping..." 
              rows="6"
              value={formData.transcription}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #ddd',
                borderRadius: '6px',
                fontSize: '1rem',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
            <small style={{ color: '#666', fontSize: '0.85rem', display: 'block', marginTop: '5px' }}>
              Transcribe the text to make it searchable and preserve the content
            </small>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={uploading}
            style={{ 
              width: '100%',
              backgroundColor: uploading ? '#999' : '#737958',
              color: 'white', 
              padding: '16px', 
              cursor: uploading ? 'not-allowed' : 'pointer',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              transition: 'background-color 0.3s'
            }}
            onMouseEnter={(e) => {
              if (!uploading) e.target.style.backgroundColor = '#5f6347';
            }}
            onMouseLeave={(e) => {
              if (!uploading) e.target.style.backgroundColor = '#737958';
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