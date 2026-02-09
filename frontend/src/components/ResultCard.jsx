import React from 'react';

const ResultCard = ({ record }) => {
  
  // 1. Function to create the APA Citation string
  const copyCitation = () => {
    const { fullName, eventDate, category, location, pdfLink, pageNumber } = record;
    
    // Format: Name (Year). Category. Location: Source, p. X.
    const citation = `${fullName} (${eventDate || 'n.d.'}). ${category}. ${location || 'Honduras'}: ${pdfLink || 'Archive Document'}, p. ${pageNumber || 's/n'}.`;
    
    navigator.clipboard.writeText(citation);
    alert("APA Citation copied to clipboard!");
  };

  return (
    <div style={{ 
      backgroundColor: 'white', 
      padding: '20px', 
      marginBottom: '20px', 
      borderRadius: '8px', 
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      border: '1px solid #737958'
    }}>
      {/* 2. Fixed Image: Cloudinary URLs are already full links, so we use record.imageUrl directly */}
      {record.imageUrl && (
        <img 
          src={record.imageUrl} 
          alt={record.fullName} 
          style={{ width: '100%', borderRadius: '4px', marginBottom: '15px', display: 'block', maxHeight: '300px', objectFit: 'cover' }} 
        />
      )}
      
      <h3 style={{ color: '#737958', margin: '0 0 10px 0' }}>{record.fullName}</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.9rem' }}>
        <p><strong>Category:</strong> {record.category}</p>
        <p><strong>Date:</strong> {record.eventDate}</p>
        <p><strong>Location:</strong> {record.location}</p>
        <p><strong>Source:</strong> {record.pdfLink} (Pg. {record.pageNumber})</p>
      </div>

      <button 
        onClick={copyCitation}
        style={{
          marginTop: '15px',
          width: '100%',
          padding: '10px',
          backgroundColor: '#737958',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        📄 Copy APA Citation
      </button>
    </div>
  );
};

export default ResultCard;