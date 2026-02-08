import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    if (onLogout) onLogout();
    navigate('/');
  };

  const linkStyle = {
    color: '#EFE7DD',
    textDecoration: 'none',
    padding: '7px 0',
    display: 'block',
    fontSize: '1rem',
    transition: 'padding-left 0.2s'
  };

  const headerStyle = {
    fontSize: '0.8rem',
    color: '#ACA37E',
    marginTop: '20px',
    textTransform: 'uppercase',
    fontWeight: 'bold'
  };

  return (
    <div style={{ 
      width: '260px', 
      backgroundColor: '#737958', 
      color: '#EFE7DD', 
      height: '100vh', 
      padding: '20px', 
      position: 'fixed', 
      overflowY: 'auto',
      boxShadow: '2px 0 8px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ 
        fontFamily: 'serif', 
        borderBottom: '2px solid #ACA37E',
        paddingBottom: '10px',
        marginBottom: '20px',
        fontSize: '1.3rem'
      }}>
        Newspaper Archive
      </h2>
      
      {/* User Info / Login */}
      {user ? (
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.1)',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '20px'
        }}>
          <p style={{ 
            margin: 0, 
            fontSize: '0.85rem', 
            marginBottom: '5px',
            color: '#ACA37E'
          }}>
            Logged in as:
          </p>
          <p style={{ 
            margin: 0, 
            fontSize: '0.95rem',
            fontWeight: 'bold',
            marginBottom: '10px'
          }}>
            {user.username}
          </p>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: '#EFE7DD',
              border: '1px solid #ACA37E',
              padding: '6px',
              borderRadius: '4px',
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            🚪 Logout
          </button>
        </div>
      ) : (
        <div style={{ marginBottom: '20px' }}>
          <Link 
            to="/login"
            style={{
              display: 'block',
              backgroundColor: 'rgba(255,255,255,0.15)',
              color: '#EFE7DD',
              textAlign: 'center',
              padding: '10px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              marginBottom: '8px'
            }}
          >
            🔐 Admin Login
          </Link>
          <Link 
            to="/register"
            style={{
              display: 'block',
              backgroundColor: 'transparent',
              color: '#EFE7DD',
              textAlign: 'center',
              padding: '10px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '0.85rem',
              border: '1px solid rgba(255,255,255,0.3)'
            }}
          >
            📝 Register
          </Link>
        </div>
      )}
      
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <Link 
          to="/" 
          style={linkStyle}
          onMouseEnter={(e) => e.target.style.paddingLeft = '10px'}
          onMouseLeave={(e) => e.target.style.paddingLeft = '0'}
        >
          🏠 Home / Search
        </Link>
        
        {user && user.role === 'admin' && (
          <Link 
            to="/upload" 
            style={{...linkStyle, fontWeight: 'bold'}}
            onMouseEnter={(e) => e.target.style.paddingLeft = '10px'}
            onMouseLeave={(e) => e.target.style.paddingLeft = '0'}
          >
            📤 Upload New File
          </Link>
        )}
        
        <Link 
          to="/contact" 
          style={linkStyle}
          onMouseEnter={(e) => e.target.style.paddingLeft = '10px'}
          onMouseLeave={(e) => e.target.style.paddingLeft = '0'}
        >
          ✉️ Contact Us
        </Link>
        
        <hr style={{ 
          borderColor: 'rgba(172, 163, 126, 0.5)', 
          width: '100%',
          margin: '15px 0' 
        }} />
        
        <h3 style={headerStyle}>COLLECTIONS</h3>
        <Link 
          to="/category/Portrait" 
          style={linkStyle}
          onMouseEnter={(e) => e.target.style.paddingLeft = '10px'}
          onMouseLeave={(e) => e.target.style.paddingLeft = '0'}
        >
          👤 Portrait
        </Link>
        <Link 
          to="/category/News" 
          style={linkStyle}
          onMouseEnter={(e) => e.target.style.paddingLeft = '10px'}
          onMouseLeave={(e) => e.target.style.paddingLeft = '0'}
        >
          📰 News & Clippings
        </Link>
        
        <h3 style={headerStyle}> NEWS ABOUT VITAL RECORDS</h3>
        <Link 
          to="/type/Birth" 
          style={linkStyle}
          onMouseEnter={(e) => e.target.style.paddingLeft = '10px'}
          onMouseLeave={(e) => e.target.style.paddingLeft = '0'}
        >
          🍼 News about Births (DOB)
        </Link>
        <Link 
          to="/type/Marriage" 
          style={linkStyle}
          onMouseEnter={(e) => e.target.style.paddingLeft = '10px'}
          onMouseLeave={(e) => e.target.style.paddingLeft = '0'}
        >
          💍News about  Marriages
        </Link>
        <Link 
          to="/type/Death" 
          style={linkStyle}
          onMouseEnter={(e) => e.target.style.paddingLeft = '10px'}
          onMouseLeave={(e) => e.target.style.paddingLeft = '0'}
        >
          ⚰️ News about Deaths (DOD)
        </Link>
      </nav>

      <div style={{ marginTop: '30px' }}>
        <h3 style={headerStyle}>SURNAME INDEX</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(5, 1fr)', 
          gap: '8px',
          marginTop: '12px'
        }}>
          {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(l => (
            <Link 
              key={l} 
              to={`/alpha/${l}`} 
              style={{ 
                color: '#EFE7DD', 
                textDecoration: 'none', 
                fontSize: '0.85rem',
                textAlign: 'center',
                padding: '5px',
                borderRadius: '4px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.25)';
                e.target.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                e.target.style.transform = 'scale(1)';
              }}
            >
              {l}
            </Link>
          ))}
        </div>
      </div>

      {/* Support Link */}
      <div style={{
        marginTop: '30px',
        paddingTop: '20px',
        borderTop: '1px solid rgba(172, 163, 126, 0.5)'
      }}>
        <a
          href="https://paypal.me/yourusername"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block',
            backgroundColor: '#0070ba',
            color: 'white',
            textAlign: 'center',
            padding: '10px',
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 'bold'
          }}
        >
          ❤️ Support the Archive
        </a>
      </div>
    </div>
  );
};

export default Sidebar;