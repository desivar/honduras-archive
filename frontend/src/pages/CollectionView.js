import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ResultCard from '../components/ResultCard';

const CollectionView = () => {
  const { type, value } = useParams(); // Gets 'category' or 'letter' from the URL
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchCollection = async () => {
      // Calls the backend using the specific filter (e.g., category=Portrait)
      const res = await axios.get(`http://localhost:5000/api/search?${type}=${value}`);
      setResults(res.data);
    };
    fetchCollection();
  }, [type, value]);

  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ color: '#737958', borderBottom: '1px solid #737958' }}>
        Viewing: {value}
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {results.length > 0 ? (
          results.map(record => <ResultCard key={record._id} record={record} />)
        ) : (
          <p>No records found in this section yet.</p>
        )}
      </div>
    </div>
  );
};

export default CollectionView;