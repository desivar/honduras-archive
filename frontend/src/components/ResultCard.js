import React from 'react';

const ResultCard = ({ record }) => {
  return (
    <div style={{ 
      backgroundColor: 'white', 
      padding: '20px', 
      marginBottom: '20px', 
      borderRadius: '8px', 
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      border: '1px solid #737958'
    }}>
      {/* 1. Point to the BACKEND port (5000) so the image actually shows up */}
      <img 
        src={`http://localhost:5000${record.imageUrl}`} 
        alt={record.fullName} 
        style={{ width: '100%', borderRadius: '4px', marginBottom: '15px', display: 'block' }} 
      />
      
      <h3 style={{ color: '#737958', margin: '0 0 10px 0' }}>{record.fullName}</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.9rem' }}>
        <p><strong>Category:</strong> {record.category}</p>
        <p><strong>Date:</strong> {record.eventDate}</p>
        <p><strong>Location:</strong> {record.location}</p>
        <p><strong>Record Type:</strong> {record.recordType}</p>
      </div>

      {record.description && (
        <div style={{ marginTop: '10px', fontSize: '0.85rem', color: '#555' }}>
          {record.description}
        </div>
      )}
    </div>
  );
};

export default ResultCard;