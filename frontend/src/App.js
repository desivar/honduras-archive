import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/SideBar';
import SearchPage from './pages/SearchPage';
import UploadPage from './pages/UploadPage';
import CollectionView from './pages/CollectionView';
import RecordDetail from './pages/RecordDetail';
import Login from './pages/LoginPage';
import Register from './pages/Register';
import Contact from './pages/Contact';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        console.log('User loaded from localStorage:', JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing stored user:', err);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    console.log('Login successful:', userData);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    console.log('Logging out');
    setUser(null);
    localStorage.removeItem('user');
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#EFE7DD'
      }}>
        <p style={{ fontSize: '1.2rem', color: '#737958' }}>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <Sidebar user={user} onLogout={handleLogout} />
        
        <div style={{ 
          marginLeft: '300px', 
          flex: 1,
          minHeight: '100vh'
        }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<SearchPage />} />
            <Route path="/record/:id" element={<RecordDetail />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Auth Routes */}
            <Route 
              path="/login" 
              element={
                user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />
              } 
            />
            <Route path="/register" element={<Register />} />
            
            {/* Admin Routes - Protected */}
            <Route 
              path="/upload" 
              element={
                user && user.role === 'admin' ? (
                  <UploadPage />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />

            {/* Collection & Filter Routes */}
            <Route path="/category/:value" element={<CollectionView type="category" />} />
            <Route path="/type/:value" element={<CollectionView type="recordType" />} />
            <Route path="/alpha/:value" element={<CollectionView type="letter" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;