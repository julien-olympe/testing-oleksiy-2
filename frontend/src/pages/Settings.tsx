import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { User } from '../types';
import { Footer } from '../components/Footer';
import './Settings.css';

export function Settings() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await api.getMe();
        setUser(data);
      } catch (err) {
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [navigate]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await api.logout();
      navigate('/login');
    } catch (err) {
      // Still navigate to login even if logout fails
      navigate('/login');
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="settings-container">
        <div className="loading">Loading...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="settings-container">
      <div className="settings-content">
        <h1>Settings</h1>
        <div className="settings-section">
          <label>Username</label>
          <div className="username-display">{user?.username}</div>
        </div>
        <div className="settings-section">
          <button
            className="logout-button"
            onClick={() => setShowLogoutConfirm(true)}
            disabled={loggingOut}
          >
            {loggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </div>
      {showLogoutConfirm && (
        <div className="modal-overlay" onClick={() => setShowLogoutConfirm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Confirm Logout</h2>
            <p>Are you sure you want to logout?</p>
            <div className="modal-actions">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="cancel-button"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="confirm-button"
                disabled={loggingOut}
              >
                {loggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
