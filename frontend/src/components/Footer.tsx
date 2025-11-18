import { Link, useLocation } from 'react-router-dom';
import './Footer.css';

export function Footer() {
  const location = useLocation();

  return (
    <footer className="footer">
      <Link
        to="/"
        className={location.pathname === '/' ? 'active' : ''}
      >
        Home
      </Link>
      <Link
        to="/my-rings"
        className={location.pathname === '/my-rings' ? 'active' : ''}
      >
        My Rings
      </Link>
      <Link
        to="/find-ring"
        className={location.pathname === '/find-ring' ? 'active' : ''}
      >
        Find Ring
      </Link>
      <Link
        to="/create-ring"
        className={location.pathname === '/create-ring' ? 'active' : ''}
      >
        Create Ring
      </Link>
      <Link
        to="/settings"
        className={location.pathname === '/settings' ? 'active' : ''}
      >
        Settings
      </Link>
    </footer>
  );
}
