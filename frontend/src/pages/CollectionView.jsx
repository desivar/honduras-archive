import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ResultCard from '../components/ResultCard';

const CollectionView = () => {
  // 'type' will be 'category', 'type', or 'alpha' based on the URL
  // 'value' will be the specific item (e.g., 'Portrait', 'Birth', or 'A')
  const { type, value } = useParams(); 
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollection = async () => {
      setLoading(true);
      try {
        
        // Replace localhost with  Render backend URL
const res = await axios.get(`https://honduras-archive.onrender.com/api/search?${type}=${value}`);
        setResults(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCollection();
  }, [type, value]);

  return (
    <div style={{ 
      marginLeft: '260px', // Matches your sidebar width
      padding: '40px', 
      backgroundColor: '#EFE7DD', 
      minHeight: '100vh' 
    }}>
      <div style={{ marginBottom: '20px' }}>
        <Link to="/" style={{ color: '#737958', textDecoration: 'none', fontSize: '0.9rem' }}>
          ← Back to Search
        </Link>
      </div>

      <h2 style={{ 
        fontFamily: 'serif', 
        color: '#737958', 
        borderBottom: '2px solid #ACA37E',
        paddingBottom: '10px',
        textTransform: 'capitalize'
      }}>
        {type.replace('alpha', 'Surname Index')}: {value}
      </h2>

      {loading ? (
        <p style={{ marginTop: '20px', color: '#666' }}>Loading records...</p>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '25px', 
          marginTop: '30px' 
        }}>
          {results.length > 0 ? (
            results.map(record => (
              <ResultCard key={record._id} record={record} />
            ))
          ) : (
            <p style={{ color: '#666' }}>No records found in this section yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CollectionView;