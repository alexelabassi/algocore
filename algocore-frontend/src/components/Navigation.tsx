import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, LogOut, Menu, X } from 'lucide-react';

export const Navigation: React.FC = () => {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav>
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          AlgoCore
        </Link>
        
        <div className="nav-links">
          <Link to="/problems" className="nav-link">
            Problems
          </Link>
          {isAuthenticated && (
            <Link to="/profile/submissions" className="nav-link">
              My Submissions
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="nav-link">
              Admin
            </Link>
          )}
        </div>

        <div className="nav-links">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2" style={{ fontSize: '0.875rem', color: '#374151' }}>
                <User style={{ width: '1rem', height: '1rem' }} />
                <span>{user?.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1"
                style={{ color: '#374151', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <LogOut style={{ width: '1rem', height: '1rem' }} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-button">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div style={{ display: 'none' }}>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ color: '#374151', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {isMobileMenuOpen ? <X style={{ width: '1.5rem', height: '1.5rem' }} /> : <Menu style={{ width: '1.5rem', height: '1.5rem' }} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div style={{ 
          display: 'block',
          padding: '0.5rem 1rem',
          backgroundColor: 'white',
          borderTop: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link
              to="/problems"
              className="nav-link"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ display: 'block', padding: '0.5rem 0.75rem' }}
            >
              Problems
            </Link>
            {isAuthenticated && (
              <Link
                to="/profile/submissions"
                className="nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ display: 'block', padding: '0.5rem 0.75rem' }}
              >
                My Submissions
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className="nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ display: 'block', padding: '0.5rem 0.75rem' }}
              >
                Admin
              </Link>
            )}
            
            {isAuthenticated ? (
              <div style={{ paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 0.75rem', fontSize: '0.875rem', color: '#374151' }}>
                  <User style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
                  <span>{user?.username}</span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="nav-link"
                  style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '0.5rem 0.75rem', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <LogOut style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div style={{ paddingTop: '1rem', borderTop: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link
                  to="/login"
                  className="nav-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ display: 'block', padding: '0.5rem 0.75rem' }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="nav-button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ display: 'block', padding: '0.5rem 0.75rem', textAlign: 'center' }}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}; 