import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Ring } from '../types';
import { Footer } from '../components/Footer';
import './FindRing.css';

export function FindRing() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [rings, setRings] = useState<Ring[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!search.trim() || search.trim().length < 1) {
      setRings([]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await api.searchRings(search.trim());
      setRings(data);
    } catch (err: any) {
      setError(err.message || 'Failed to search rings');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (ringId: string) => {
    try {
      await api.joinRing(ringId);
      navigate(`/rings/${ringId}`);
    } catch (err: any) {
      setError(err.message || 'Failed to join ring');
    }
  };

  return (
    <div className="find-ring-container">
      <div className="find-ring-content">
        <h1>Find Ring</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for rings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          <button onClick={handleSearch} disabled={loading || search.trim().length < 1}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="search-results">
          {rings.length === 0 && search.trim().length >= 1 && !loading ? (
            <div className="empty-state">No rings found</div>
          ) : (
            rings.map((ring) => (
              <div key={ring.id} className="ring-result">
                <div>
                  <div className="ring-name">{ring.name}</div>
                  <div className="ring-member-count">
                    {ring.memberCount} member{ring.memberCount !== 1 ? 's' : ''}
                  </div>
                </div>
                {ring.isMember ? (
                  <div className="member-badge">Member</div>
                ) : (
                  <button
                    className="join-button"
                    onClick={() => handleJoin(ring.id)}
                  >
                    Join
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
