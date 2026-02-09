import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PortraitGallery = () => {
  const [portraits, setPortraits] = useState([]);

  useEffect(() => {
    const fetchPortraits = async () => {
      const res = await axios.get('http://localhost:5000/api/search?category=Portrait');
      setPortraits(res.data);
    };
    fetchPortraits();
  }, []);

  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ color: '#737958' }}>Family Portraits</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        {portraits.map(p => (
          <div key={p._id} style={{ border: '1px solid #737958', padding: '10px', textAlign: 'center' }}>
            <img src={p.imageUrl} alt={p.fullName} style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
            <p style={{ fontWeight: 'bold', marginTop: '10px' }}>{p.fullName}</p>
            <p style={{ fontSize: '0.8rem' }}>{p.eventDate}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortraitGallery;