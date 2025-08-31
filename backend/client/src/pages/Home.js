import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="container">
      {/* Hero Section */}
      <div style={{
        textAlign: 'center',
        padding: '4rem 0',
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
        borderRadius: '2rem',
        color: 'var(--white)',
        marginBottom: '4rem'
      }}>
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: '700',
          marginBottom: '1rem',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}>
          Secure Online Voting System
        </h1>
        <p style={{
          fontSize: '1.25rem',
          marginBottom: '2rem',
          opacity: '0.9',
          maxWidth: '600px',
          margin: '0 auto 2rem'
        }}>
          Empowering trade unions with transparent, secure, and accessible digital voting solutions
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {user ? (
            <Link to="/dashboard" className="btn btn-secondary">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-secondary">
                Get Started
              </Link>
              <Link to="/login" className="btn btn-outline" style={{ color: 'var(--white)', borderColor: 'var(--white)' }}>
                Login
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-3" style={{ marginBottom: '4rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '1rem',
            color: 'var(--primary)'
          }}>
            🔒
          </div>
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
            Secure & Transparent
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Advanced encryption and blockchain-like verification ensure every vote is secure and verifiable
          </p>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '1rem',
            color: 'var(--primary)'
          }}>
            📱
          </div>
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
            Accessible Anywhere
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Vote from any device, anywhere in the world with our responsive web platform
          </p>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '1rem',
            color: 'var(--primary)'
          }}>
            📊
          </div>
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
            Real-time Results
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Instant vote counting and real-time result updates for complete transparency
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div style={{ marginBottom: '4rem' }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: '2.5rem',
          fontWeight: '600',
          color: 'var(--primary)',
          marginBottom: '2rem'
        }}>
          How It Works
        </h2>
        
        <div className="grid grid-cols-4" style={{ gap: '2rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              color: 'var(--white)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              margin: '0 auto 1rem'
            }}>
              1
            </div>
            <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Register
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Create your account with membership verification
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              color: 'var(--white)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              margin: '0 auto 1rem'
            }}>
              2
            </div>
            <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Verify
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Complete OTP verification for secure access
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              color: 'var(--white)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              margin: '0 auto 1rem'
            }}>
              3
            </div>
            <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Vote
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Cast your vote in active elections
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              color: 'var(--white)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              margin: '0 auto 1rem'
            }}>
              4
            </div>
            <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Results
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              View real-time results and outcomes
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div style={{
        textAlign: 'center',
        padding: '3rem',
        backgroundColor: 'var(--white)',
        borderRadius: '1rem',
        border: '2px solid var(--light)'
      }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '600',
          color: 'var(--primary)',
          marginBottom: '1rem'
        }}>
          Ready to Get Started?
        </h2>
        <p style={{
          color: 'var(--text-secondary)',
          marginBottom: '2rem',
          fontSize: '1.125rem'
        }}>
          Join thousands of trade union members who trust Helios for secure online voting
        </p>
        {!user && (
          <Link to="/register" className="btn btn-primary" style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}>
            Create Your Account
          </Link>
        )}
      </div>
    </div>
  );
};

export default Home;
