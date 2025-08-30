import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home', public: true },
    { path: '/elections', label: 'Elections', protected: true },
    { path: '/voting-history', label: 'Voting History', protected: true },
    { path: '/profile', label: 'Profile', protected: true },
    { path: '/admin', label: 'Admin', protected: true, adminOnly: true }
  ];

  const filteredNavLinks = navLinks.filter(link => {
    if (link.public) return true;
    if (link.protected && user) {
      if (link.adminOnly) return isAdmin;
      return true;
    }
    return false;
  });

  return (
    <nav className="nav">
      <div className="container nav-container">
        <Link to="/" className="nav-brand">
          🗳️ Helios Voting
        </Link>

        {/* Desktop Navigation */}
        <ul className="nav-menu" style={{ display: isMobileMenuOpen ? 'none' : 'flex' }}>
          {filteredNavLinks.map(link => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
          
          {user ? (
            <li>
              <button
                onClick={handleLogout}
                className="btn btn-outline"
                style={{ marginLeft: '1rem' }}
              >
                Logout
              </button>
            </li>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  className={`nav-link ${isActive('/login') ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="btn btn-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="btn btn-outline"
          style={{ display: 'none' }}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div style={{
          backgroundColor: 'var(--white)',
          borderTop: '1px solid var(--light)',
          padding: '1rem 0'
        }}>
          <div className="container">
            <ul style={{
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {filteredNavLinks.map(link => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{ display: 'block', padding: '0.5rem 0' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              
              {user ? (
                <li>
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline"
                    style={{ width: '100%', justifyContent: 'flex-start' }}
                  >
                    Logout
                  </button>
                </li>
              ) : (
                <>
                  <li>
                    <Link
                      to="/login"
                      className={`nav-link ${isActive('/login') ? 'active' : ''}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      style={{ display: 'block', padding: '0.5rem 0' }}
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className="btn btn-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Responsive styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .nav-menu {
            display: none !important;
          }
          
          button[class*="btn-outline"] {
            display: inline-flex !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navigation;
