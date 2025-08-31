import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  if (!user) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '2rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>
            Your Profile 👤
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>
            View and manage your account information
          </p>
        </div>

        {/* Profile Card */}
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="card-title">Profile Information</h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn btn-outline"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
            {/* Personal Information */}
            <div>
              <h4 style={{ color: 'var(--primary)', marginBottom: '1rem', borderBottom: '2px solid var(--light)', paddingBottom: '0.5rem' }}>
                Personal Information
              </h4>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontWeight: '600', color: 'var(--text-primary)', display: 'block', marginBottom: '0.25rem' }}>
                  Full Name
                </label>
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--background)', borderRadius: '0.5rem', color: 'var(--text-primary)' }}>
                  {user.fullName}
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontWeight: '600', color: 'var(--text-primary)', display: 'block', marginBottom: '0.25rem' }}>
                  Membership ID
                </label>
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--background)', borderRadius: '0.5rem', color: 'var(--text-primary)' }}>
                  {user.membershipId}
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontWeight: '600', color: 'var(--text-primary)', display: 'block', marginBottom: '0.25rem' }}>
                  Email Address
                </label>
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--background)', borderRadius: '0.5rem', color: 'var(--text-primary)' }}>
                  {user.email}
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontWeight: '600', color: 'var(--text-primary)', display: 'block', marginBottom: '0.25rem' }}>
                  Mobile Number
                </label>
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--background)', borderRadius: '0.5rem', color: 'var(--text-primary)' }}>
                  {user.mobile}
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontWeight: '600', color: 'var(--text-primary)', display: 'block', marginBottom: '0.25rem' }}>
                  Date of Birth
                </label>
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--background)', borderRadius: '0.5rem', color: 'var(--text-primary)' }}>
                  {new Date(user.dateOfBirth).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h4 style={{ color: 'var(--primary)', marginBottom: '1rem', borderBottom: '2px solid var(--light)', paddingBottom: '0.5rem' }}>
                Additional Information
              </h4>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontWeight: '600', color: 'var(--text-primary)', display: 'block', marginBottom: '0.25rem' }}>
                  Division
                </label>
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--background)', borderRadius: '0.5rem', color: 'var(--text-primary)' }}>
                  {user.division}
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontWeight: '600', color: 'var(--text-primary)', display: 'block', marginBottom: '0.25rem' }}>
                  NIC Number
                </label>
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--background)', borderRadius: '0.5rem', color: 'var(--text-primary)' }}>
                  {user.nic}
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontWeight: '600', color: 'var(--text-primary)', display: 'block', marginBottom: '0.25rem' }}>
                  Role
                </label>
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--background)', borderRadius: '0.5rem', color: 'var(--text-primary)' }}>
                  <span className={`badge ${user.role === 'admin' ? 'badge-success' : 'badge-info'}`}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontWeight: '600', color: 'var(--text-primary)', display: 'block', marginBottom: '0.25rem' }}>
                  Account Status
                </label>
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--background)', borderRadius: '0.5rem', color: 'var(--text-primary)' }}>
                  <span className={`badge ${user.isActive ? 'badge-success' : 'badge-error'}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontWeight: '600', color: 'var(--text-primary)', display: 'block', marginBottom: '0.25rem' }}>
                  Member Since
                </label>
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--background)', borderRadius: '0.5rem', color: 'var(--text-primary)' }}>
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div style={{ marginTop: '2rem' }}>
            <h4 style={{ color: 'var(--primary)', marginBottom: '1rem', borderBottom: '2px solid var(--light)', paddingBottom: '0.5rem' }}>
              Address Information
            </h4>
            
            <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
              <div>
                <label style={{ fontWeight: '600', color: 'var(--text-primary)', display: 'block', marginBottom: '0.25rem' }}>
                  Street Address
                </label>
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--background)', borderRadius: '0.5rem', color: 'var(--text-primary)' }}>
                  {user.address.street}
                </div>
              </div>

              <div>
                <label style={{ fontWeight: '600', color: 'var(--text-primary)', display: 'block', marginBottom: '0.25rem' }}>
                  City
                </label>
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--background)', borderRadius: '0.5rem', color: 'var(--text-primary)' }}>
                  {user.address.city}
                </div>
              </div>

              <div>
                <label style={{ fontWeight: '600', color: 'var(--text-primary)', display: 'block', marginBottom: '0.25rem' }}>
                  State
                </label>
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--background)', borderRadius: '0.5rem', color: 'var(--text-primary)' }}>
                  {user.address.state}
                </div>
              </div>

              <div>
                <label style={{ fontWeight: '600', color: 'var(--text-primary)', display: 'block', marginBottom: '0.25rem' }}>
                  Postal Code
                </label>
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--background)', borderRadius: '0.5rem', color: 'var(--text-primary)' }}>
                  {user.address.postalCode}
                </div>
              </div>
            </div>
          </div>

          {/* Last Login */}
          {user.lastLogin && (
            <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'var(--background)', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <strong>Last Login:</strong> {new Date(user.lastLogin).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          )}
        </div>

        {/* Security Note */}
        <div className="card" style={{ marginTop: '2rem', backgroundColor: 'rgba(61, 82, 160, 0.05)', border: '1px solid var(--light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '1.5rem' }}>🔒</div>
            <div>
              <h4 style={{ color: 'var(--primary)', margin: '0 0 0.5rem 0' }}>Security Information</h4>
              <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.875rem' }}>
                Your password and sensitive information are securely encrypted. For security reasons, 
                some fields cannot be edited directly. Contact an administrator if you need to make changes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
