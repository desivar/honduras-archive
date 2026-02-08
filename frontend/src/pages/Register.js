import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    whatsapp: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        whatsapp: formData.whatsapp
      });

      if (response.data.success) {
        alert('Account created successfully! Please log in.');
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#EFE7DD',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        border: '2px solid #737958',
        maxWidth: '450px',
        width: '100%',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{
          color: '#737958',
          textAlign: 'center',
          marginBottom: '10px',
          fontSize: '1.8rem'
        }}>
          Create Account
        </h2>
        
        <p style={{
          textAlign: 'center',
          color: '#666',
          marginBottom: '30px',
          fontSize: '0.9rem',
          lineHeight: '1.5'
        }}>
          Register to contact us, support the project, or save favorites
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '18px' }}>
            <label style={{
              display: 'block',
              color: '#737958',
              marginBottom: '6px',
              fontWeight: 'bold',
              fontSize: '0.9rem'
            }}>
              Username *
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #ddd',
                borderRadius: '6px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={{
              display: 'block',
              color: '#737958',
              marginBottom: '6px',
              fontWeight: 'bold',
              fontSize: '0.9rem'
            }}>
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #ddd',
                borderRadius: '6px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={{
              display: 'block',
              color: '#737958',
              marginBottom: '6px',
              fontWeight: 'bold',
              fontSize: '0.9rem'
            }}>
              WhatsApp (optional)
            </label>
            <input
              type="text"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              placeholder="+504 XXXX-XXXX"
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #ddd',
                borderRadius: '6px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={{
              display: 'block',
              color: '#737958',
              marginBottom: '6px',
              fontWeight: 'bold',
              fontSize: '0.9rem'
            }}>
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #ddd',
                borderRadius: '6px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: '#737958',
              marginBottom: '6px',
              fontWeight: 'bold',
              fontSize: '0.9rem'
            }}>
              Confirm Password *
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #ddd',
                borderRadius: '6px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {error && (
            <div style={{
              backgroundColor: '#ffebee',
              color: '#c62828',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '20px',
              fontSize: '0.9rem',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: loading ? '#999' : '#737958',
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: '6px',
              fontSize: '1.05rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={{
          marginTop: '25px',
          textAlign: 'center',
          paddingTop: '20px',
          borderTop: '1px solid #ddd'
        }}>
          <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '10px' }}>
            Already have an account?
          </p>
          <Link
            to="/login"
            style={{
              color: '#737958',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '0.95rem'
            }}
          >
            Sign In
          </Link>
        </div>

        <div style={{
          marginTop: '20px',
          textAlign: 'center'
        }}>
          <Link
            to="/"
            style={{
              color: '#999',
              textDecoration: 'none',
              fontSize: '0.9rem'
            }}
          >
            ← Back to Search
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;