import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Post, Ring } from '../types';
import { Footer } from '../components/Footer';
import './RingChat.css';

export function RingChat() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ring, setRing] = useState<Ring | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [messageText, setMessageText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [addUserUsername, setAddUserUsername] = useState('');
  const [addingUser, setAddingUser] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadRing = async () => {
    if (!id) return;
    try {
      const data = await api.getRing(id);
      setRing(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load ring');
    }
  };

  const loadPosts = async () => {
    if (!id) return;
    try {
      setError('');
      const data = await api.getRingPosts(id);
      setPosts(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRing();
    loadPosts();
  }, [id]);

  // Poll every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadPosts();
    }, 30000);

    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [posts]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !messageText.trim()) return;

    setPosting(true);
    setError('');

    try {
      await api.createPost(id, messageText, imageFile || undefined);
      setMessageText('');
      setImageFile(null);
      setImagePreview(null);
      await loadPosts();
    } catch (err: any) {
      setError(err.message || 'Failed to create post');
    } finally {
      setPosting(false);
    }
  };

  const handleAddUser = async () => {
    if (!id || !addUserUsername.trim()) return;

    setAddingUser(true);
    setError('');

    try {
      await api.addMember(id, addUserUsername.trim());
      setShowAddUserModal(false);
      setAddUserUsername('');
      await loadRing();
    } catch (err: any) {
      setError(err.message || 'Failed to add user');
    } finally {
      setAddingUser(false);
    }
  };

  return (
    <div className="ring-chat-container">
      <div className="ring-chat-content">
        {ring && (
          <div className="ring-chat-header">
            <div>
              <h1>{ring.name}</h1>
              <div className="member-count">
                {ring.memberCount} member{ring.memberCount !== 1 ? 's' : ''}
              </div>
            </div>
            <button
              className="add-user-button"
              onClick={() => setShowAddUserModal(true)}
            >
              Add User
            </button>
          </div>
        )}
        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error-message">{error}</div>}
        {!loading && (
          <div className="messages">
            {posts.length === 0 ? (
              <div className="empty-state">No messages yet</div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="message">
                  <div className="message-header">
                    <span className="message-author">{post.username}</span>
                    <span className="message-timestamp">
                      {new Date(post.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt="Post"
                      className="message-image"
                      onClick={() => window.open(post.imageUrl!, '_blank')}
                    />
                  )}
                  <div className="message-text">{post.messageText}</div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
        <form onSubmit={handleSubmit} className="message-form">
          <div className="message-input-container">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your message..."
              maxLength={5000}
              rows={3}
              className="message-input"
            />
            <div className="message-actions">
              <label className="image-upload-button">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                📷
              </label>
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                  >
                    ×
                  </button>
                </div>
              )}
              <button
                type="submit"
                disabled={posting || !messageText.trim()}
                className="post-button"
              >
                {posting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </form>
      </div>
      {showAddUserModal && (
        <div className="modal-overlay" onClick={() => setShowAddUserModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Add User to Ring</h2>
            <input
              type="text"
              placeholder="Username"
              value={addUserUsername}
              onChange={(e) => setAddUserUsername(e.target.value)}
              className="modal-input"
            />
            <div className="modal-actions">
              <button
                onClick={() => {
                  setShowAddUserModal(false);
                  setAddUserUsername('');
                }}
                className="cancel-button"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                disabled={addingUser || !addUserUsername.trim()}
                className="add-button"
              >
                {addingUser ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
