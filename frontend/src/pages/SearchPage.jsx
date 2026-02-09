import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ResultCard from '../components/ResultCard';

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load all records when the page first opens
  useEffect(() => {
    fetchAllRecords();
  }, []);

  const fetchAllRecords = async () => {
    setLoading(true);
    try {
      // Changed from localhost to your live Render Backend URL
      const response = await axios.get(`https://recuerdos-4lm3.onrender.com/api/search`);
      setResults(response.data);
    } catch (error) {
      console.error("Error loading archive:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault(); // Prevent page reload if inside a form
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/search?name=${query}`);
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching from database:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#737958', marginBottom: '20px' }}>Recuerdos de Honduras</h1>
      
      {/* Search Input Group */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <input 
          type="text" 
          placeholder="Search by name (e.g. Gravina)..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()} // Search on Enter key
          style={{ 
            padding: '12px', 
            flex: 1, 
            borderRadius: '6px', 
            border: '1px solid #737958',
            fontSize: '1rem' 
          }}
        />
        <button 
          onClick={handleSearch}
          style={{ 
            padding: '12px 24px', 
            backgroundColor: '#737958', 
            color: 'white', 
            border: 'none', 
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Searching...' : 'Search Archive'}
        </button>
      </div>

      {/* Results Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '20px' 
      }}>
        {results.length > 0 ? (
          results.map(record => <ResultCard key={record._id} record={record} />)
        ) : (
          !loading && <p style={{ textAlign: 'center', color: '#666' }}>No real records found. Try a different name!</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;