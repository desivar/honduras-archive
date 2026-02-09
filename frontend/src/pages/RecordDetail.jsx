import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RecordDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/record/${id}`);
        setRecord(response.data);
      } catch (error) {
        console.error('Error fetching record:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [id]);

  const handleCopyLink = () => {
    const citationLink = `${window.location.origin}/record/${id}`;
    navigator.clipboard.writeText(citationLink);
    setCopySuccess('✓ Link copied!');
    setTimeout(() => setCopySuccess(''), 2000);
  };

  const handleCopyImage = async () => {
    try {
      const imageUrl = `http://localhost:5000${record.imageUrl}`;
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ]);
      
      setCopySuccess('✓ Image copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (error) {
      console.error('Error copying image:', error);
      setCopySuccess('✗ Copy failed (try right-click → Save Image)');
      setTimeout(() => setCopySuccess(''), 3000);
    }
  };

  const generateCitation = () => {
    if (!record) return '';
    
    return `"${record.fullName}," ${record.category}, ${record.eventDate || 'n.d.'}, ${record.location || 'Honduras'}. Recuerdos de Honduras Newspaper Archive. ${window.location.href}`;
  };

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(generateCitation());
    setCopySuccess('✓ Citation copied!');
    setTimeout(() => setCopySuccess(''), 2000);
  };

  if (loading) {
    return (
      <div style={{ 
        backgroundColor: '#EFE7DD', 
        minHeight: '100vh', 
        padding: '40px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <p style={{ fontSize: '1.2rem', color: '#737958' }}>Loading record...</p>
      </div>
    );
  }

  if (!record) {
    return (
      <div style={{ 
        backgroundColor: '#EFE7DD', 
        minHeight: '100vh', 
        padding: '40px',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#737958' }}>Record not found</h2>
        <button 
          onClick={() => navigate('/')}
          style={{
            backgroundColor: '#737958',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1rem',
            marginTop: '20px'
          }}
        >
          ← Back to Search
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      backgroundColor: '#EFE7DD', 
      minHeight: '100vh', 
      padding: '40px' 
    }}>
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        style={{
          backgroundColor: 'transparent',
          color: '#737958',
          border: '2px solid #737958',
          padding: '10px 20px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '1rem',
          marginBottom: '20px',
          transition: 'all 0.3s'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#737958';
          e.target.style.color = 'white';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'transparent';
          e.target.style.color = '#737958';
        }}
      >
        ← Back
      </button>

      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '40px',
        alignItems: 'start'
      }}>
        {/* Image Section */}
        <div>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            border: '2px solid #737958'
          }}>
            <img 
              src={`http://localhost:5000${record.imageUrl}`}
              alt={record.fullName}
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '4px',
                display: 'block'
              }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            marginTop: '15px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={handleCopyImage}
              style={{
                flex: 1,
                backgroundColor: '#737958',
                color: 'white',
                border: 'none',
                padding: '12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: 'bold'
              }}
            >
              📋 Copy Image
            </button>
            
            <a
              href={`http://localhost:5000${record.imageUrl}`}
              download={`${record.fullName.replace(/\s+/g, '_')}.jpg`}
              style={{
                flex: 1,
                backgroundColor: '#ACA37E',
                color: 'white',
                border: 'none',
                padding: '12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: 'bold',
                textDecoration: 'none',
                textAlign: 'center',
                display: 'block'
              }}
            >
              💾 Download
            </a>
          </div>
        </div>

        {/* Metadata Section */}
        <div>
          <h1 style={{ 
            color: '#737958', 
            marginTop: 0,
            marginBottom: '20px',
            fontSize: '2rem'
          }}>
            {record.fullName}
          </h1>

          {/* Category Badge */}
          <div style={{ marginBottom: '20px' }}>
            <span style={{
              backgroundColor: '#737958',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '0.9rem',
              fontWeight: 'bold'
            }}>
              {record.category}
            </span>
          </div>

          {/* Details */}
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            marginBottom: '20px'
          }}>
            {record.eventDate && (
              <div style={{ marginBottom: '15px' }}>
                <strong style={{ color: '#737958' }}>Date:</strong>
                <p style={{ margin: '5px 0 0 0' }}>{record.eventDate}</p>
              </div>
            )}

            {record.location && (
              <div style={{ marginBottom: '15px' }}>
                <strong style={{ color: '#737958' }}>Location:</strong>
                <p style={{ margin: '5px 0 0 0' }}>{record.location}</p>
              </div>
            )}

            {record.recordType && (
              <div style={{ marginBottom: '15px' }}>
                <strong style={{ color: '#737958' }}>Record Type:</strong>
                <p style={{ margin: '5px 0 0 0' }}>{record.recordType}</p>
              </div>
            )}

            {record.transcription && (
              <div>
                <strong style={{ color: '#737958' }}>Transcription:</strong>
                <p style={{ 
                  margin: '10px 0 0 0',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap'
                }}>
                  {record.transcription}
                </p>
              </div>
            )}
          </div>

          {/* Citation Section */}
          <div style={{
            backgroundColor: '#f9f9f9',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #ddd'
          }}>
            <h3 style={{ 
              color: '#737958', 
              marginTop: 0,
              marginBottom: '15px',
              fontSize: '1.1rem'
            }}>
              Citation
            </h3>
            
            <p style={{
              fontSize: '0.9rem',
              lineHeight: '1.6',
              color: '#555',
              fontStyle: 'italic',
              marginBottom: '15px',
              padding: '10px',
              backgroundColor: 'white',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}>
              {generateCitation()}
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleCopyCitation}
                style={{
                  flex: 1,
                  backgroundColor: '#737958',
                  color: 'white',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                📄 Copy Citation
              </button>

              <button
                onClick={handleCopyLink}
                style={{
                  flex: 1,
                  backgroundColor: '#ACA37E',
                  color: 'white',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                🔗 Copy Link
              </button>
            </div>

            {copySuccess && (
              <p style={{
                marginTop: '10px',
                color: '#4CAF50',
                fontWeight: 'bold',
                textAlign: 'center'
              }}>
                {copySuccess}
              </p>
            )}
          </div>

          {/* PDF Source Link */}
          {record.pdfSource && (
            <div style={{ marginTop: '20px' }}>
              <a
                href={record.pdfSource}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  backgroundColor: '#555',
                  color: 'white',
                  padding: '12px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '0.95rem'
                }}
              >
                📑 View Full PDF Source
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecordDetail;