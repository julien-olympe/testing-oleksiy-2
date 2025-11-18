import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Post } from '../types';
import { Footer } from '../components/Footer';
import './Home.css';

export function Home() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadNewsFeed = async () => {
    try {
      setError('');
      const data = await api.getNewsFeed(search || undefined);
      setPosts(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load news feed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNewsFeed();
  }, [search]);

  // Poll every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadNewsFeed();
    }, 30000);

    return () => clearInterval(interval);
  }, [search]);

  const truncateMessage = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search rings by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error-message">{error}</div>}
        {!loading && !error && (
          <div className="news-feed">
            {posts.length === 0 ? (
              <div className="empty-state">No posts found</div>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="news-tile"
                  onClick={() => navigate(`/rings/${post.ringId}`)}
                >
                  <div className="news-tile-header">
                    <span className="ring-name">{post.ringName}</span>
                    <span className="timestamp">
                      {new Date(post.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt="Post"
                      className="news-tile-image"
                    />
                  )}
                  <div className="news-tile-message">
                    {truncateMessage(post.messageText)}
                  </div>
                  <div className="news-tile-author">by {post.username}</div>
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
