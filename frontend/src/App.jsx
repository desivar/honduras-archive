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
import AdminPanel from './pages/AdminPanel'; // Your new user management page

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        console.log('User session restored:', parsedUser.username);
      } catch (err) {
        console.error('Error parsing user session:', err);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    // userData should include { username, role, token } from your backend
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    if (userData.token) {
      localStorage.setItem('token', userData.token);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    console.log('User logged out');
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
        <p style={{ fontSize: '1.2rem', color: '#737958', fontWeight: 'bold' }}>
          Cargando Archivo...
        </p>
      </div>
    );
  }

  return (
    <Router>
      <div style={{ display: 'flex', backgroundColor: '#EFE7DD', minHeight: '100vh' }}>
        {/* Sidebar always visible, handles role-based links internally */}
        <Sidebar user={user} onLogout={handleLogout} />
        
        <div style={{ 
          marginLeft: '300px', // Matches your Sidebar width
          flex: 1,
          padding: '20px'
        }}>
          <Routes>
            {/* --- Public Routes --- */}
            <Route path="/" element={<SearchPage />} />
            <Route path="/record/:id" element={<RecordDetail />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* --- Auth Routes --- */}
            <Route 
              path="/login" 
              element={user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />} 
            />
            <Route path="/register" element={<Register />} />
            
            {/* --- Admin/Collaborator Routes --- */}
            {/* Only allow users with 'admin' role to access these */}
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

            <Route 
              path="/admin" 
              element={
                user && user.role === 'admin' ? (
                  <AdminPanel />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />

            {/* --- Archive Navigation Routes --- */}
            <Route path="/category/:value" element={<CollectionView type="category" />} />
            <Route path="/type/:value" element={<CollectionView type="recordType" />} />
            <Route path="/alpha/:value" element={<CollectionView type="letter" />} />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;