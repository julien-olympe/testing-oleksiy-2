import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Ring } from '../types';
import { Footer } from '../components/Footer';
import './MyRings.css';

export function MyRings() {
  const navigate = useNavigate();
  const [rings, setRings] = useState<Ring[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadRings = async () => {
    try {
      setError('');
      const data = await api.getRings(search || undefined);
      setRings(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load rings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRings();
  }, [search]);

  const ellipsizeName = (name: string, maxLength: number = 20) => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength) + '...';
  };

  return (
    <div className="my-rings-container">
      <div className="my-rings-content">
        <h1>My Rings</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search rings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error-message">{error}</div>}
        {!loading && !error && (
          <div className="rings-list">
            {rings.length === 0 ? (
              <div className="empty-state">No rings found</div>
            ) : (
              rings.map((ring) => (
                <div
                  key={ring.id}
                  className="ring-item"
                  onClick={() => navigate(`/rings/${ring.id}`)}
                >
                  <div className="ring-name">{ellipsizeName(ring.name)}</div>
                  <div className="ring-member-count">
                    {ring.memberCount} member{ring.memberCount !== 1 ? 's' : ''}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
