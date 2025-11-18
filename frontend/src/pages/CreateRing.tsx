import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Footer } from '../components/Footer';
import './CreateRing.css';

export function CreateRing() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError('');

    try {
      const ring = await api.createRing(name.trim());
      navigate(`/rings/${ring.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create ring');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-ring-container">
      <div className="create-ring-content">
        <h1>Create Ring</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="ring-name">Ring Name</label>
            <input
              id="ring-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter ring name..."
              maxLength={100}
              required
            />
            <div className="character-count">
              {name.length}/100
            </div>
          </div>
          {error && <div className="error-message">{error}</div>}
          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="create-button"
          >
            {loading ? 'Creating...' : 'Create Ring'}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}
