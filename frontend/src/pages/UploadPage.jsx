import React, { useState } from 'react';
import axios from 'axios';

const UploadPage = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    names: "", birthOrigin: "", category: "Portrait", 
    eventDate: "", eventLocation: "", newspaperName: "", 
    pageNumber: "", summary: ""
  });
  const [image, setImage] = useState(null);

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (image) data.append('image', image);

    try {
      const token = localStorage.getItem('token');
      await axios.post('https://honduras-archive.onrender.com/api/archive', data, {
        headers: { 'Content-Type': 'multipart/form-data', 'x-auth-token': token }
      });
      alert("Record Saved!");
    } catch (err) { alert("Error saving record."); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', backgroundColor: '#fff', borderRadius: '8px' }}>
      <h2 style={{ color: '#737958' }}>New Archive Entry</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input name="names" placeholder="Full Name(s)" onChange={handleChange} required style={inputStyle} />
        <input name="birthOrigin" placeholder="Origin of Person (e.g. from New York)" onChange={handleChange} style={inputStyle} />
        <select name="category" onChange={handleChange} style={inputStyle}>
          <option value="Portrait">Portrait</option>
          <option value="News">News / Clipping</option>
        </select>
        <input name="eventDate" placeholder="Date" onChange={handleChange} style={inputStyle} />
        <input name="eventLocation" placeholder="Event Location (e.g. Tegucigalpa)" onChange={handleChange} style={inputStyle} />
        <input name="newspaperName" placeholder="Source Name" onChange={handleChange} style={inputStyle} />
        <input name="pageNumber" placeholder="Page #" onChange={handleChange} style={inputStyle} />
        <textarea name="summary" placeholder="Summary of the record..." onChange={handleChange} rows="4" style={inputStyle} />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} accept="image/*" />
        <button type="submit" disabled={loading} style={{ padding: '12px', backgroundColor: '#737958', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {loading ? "Saving..." : "Upload to Archive"}
        </button>
      </form>
    </div>
  );
};

const inputStyle = { padding: '10px', borderRadius: '4px', border: '1px solid #ccc' };
export default UploadPage;