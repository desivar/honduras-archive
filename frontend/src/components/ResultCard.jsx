import React from 'react';
import axios from 'axios'; // 🟢 Added for delete request

const ResultCard = ({ record, onDeleteSuccess }) => {
  
  // 🟢 1. Check if the user is an admin to show Edit/Delete buttons
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const isAdmin = user && user.role === 'admin';

  // ✅ FIXED: Handle names array from backend
  const displayName = Array.isArray(record.names) 
    ? record.names.join(', ') 
    : record.fullName || 'Unknown';
  
  // 🟢 2. Delete Logic
  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${displayName}"?`)) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://honduras-archive.onrender.com/api/archive/${record._id}`, {
          headers: { 'x-auth-token': token }
        });
        alert("Record deleted successfully");
        if (onDeleteSuccess) onDeleteSuccess(); // Refreshes the list
      } catch (err) {
        alert("Error deleting record");
      }
    }
  };

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
        
        {/* 🟢 3. Added a preview of the "Large News" content */}
        {record.description && (
          <p style={{ marginBottom: '8px', fontStyle: 'italic' }}>
            {record.description.substring(0, 100)}...
          </p>
        )}

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

      {/* 🟢 4. New Admin Buttons: Only show if isAdmin is true */}
      {isAdmin && (
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button 
            onClick={() => window.location.href = `/edit/${record._id}`}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: '#586379',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ✏️ Edit
          </button>
          <button 
            onClick={handleDelete}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: '#a94442',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🗑️ Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ResultCard;