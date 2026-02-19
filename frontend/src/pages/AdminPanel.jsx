import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Load the users when the page opens
    axios.get('https://honduras-archive.onrender.com/api/auth/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  const changeRole = async (userId, newRole) => {
    try {
      await axios.put(`https://honduras-archive.onrender.com/api/auth/users/role/${userId}`, { role: newRole });
      alert("Role updated!");
      // Refresh the list
      window.location.reload();
    } catch (err) {
      alert("Error updating role");
    }
  };

  return (
    <div style={{ padding: '40px', backgroundColor: '#EFE7DD', minHeight: '100vh' }}>
      <h2 style={{ color: '#737958' }}>Collaborator Management</h2>
      <table style={{ width: '100%', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden' }}>
        <thead style={{ backgroundColor: '#737958', color: 'white' }}>
          <tr>
            <th style={{ padding: '10px' }}>Username</th>
            <th style={{ padding: '10px' }}>Role</th>
            <th style={{ padding: '10px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id} style={{ textAlign: 'center', borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px' }}>{user.username}</td>
              <td style={{ padding: '10px' }}>{user.role}</td>
              <td style={{ padding: '10px' }}>
                {user.role === 'visitor' && (
                  <button onClick={() => changeRole(user._id, 'admin')} style={{ backgroundColor: '#737958', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                    Promote to Admin
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;