import React from 'react';

const ResultCard = ({ record }) => {
  
  // ✅ FIXED: Handle names array from backend
  const displayName = Array.isArray(record.names) 
    ? record.names.join(', ') 
    : record.fullName || 'Unknown';
  
  const copyCitation = () => {
    const { eventDate, category, location, pdfLink, pageNumber } = record;
    
    const citation = `${displayName} (${eventDate || 'n.d.'}). ${category}. ${location || 'Honduras'}: ${pdfLink || 'Archive Document'}, p. ${pageNumber || 's/n'}.`;
    
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
      border: '2px solid #737958'
    }}>
      {record.imageUrl && (
        <img 
          src={record.imageUrl} 
          alt={displayName} 
          style={{ 
            width: '100%', 
            borderRadius: '4px', 
            marginBottom: '15px', 
            display: 'block', 
            maxHeight: '300px', 
            objectFit: 'cover' 
          }} 
        />
      )}
      
      <h3 style={{ color: '#737958', margin: '0 0 10px 0', fontSize: '1.3rem' }}>
        {displayName}
      </h3>
      
      <div style={{ fontSize: '0.9rem', color: '#333' }}>
        <p style={{ marginBottom: '8px' }}><strong>Category:</strong> {record.category}</p>
        <p style={{ marginBottom: '8px' }}><strong>Date:</strong> {record.eventDate}</p>
        <p style={{ marginBottom: '8px' }}><strong>Location:</strong> {record.location}</p>
        {record.pdfLink && (
          <p style={{ marginBottom: '8px' }}>
            <strong>Source:</strong> {record.pdfLink} {record.pageNumber && `(Pg. ${record.pageNumber})`}
          </p>
        )}
      </div>

      <button 
        onClick={copyCitation}
        style={{
          marginTop: '15px',
          width: '100%',
          padding: '12px',
          backgroundColor: '#737958',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '0.95rem'
        }}
      >
        📄 Copy APA Citation
      </button>
    </div>
  );
};

export default ResultCard;