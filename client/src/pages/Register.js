import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    membershipId: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobile: '',
    dateOfBirth: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: ''
    },
    nic: '',
    division: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const divisions = [
    'IT', 'Finance', 'HR', 'Operations', 
    'Marketing', 'Sales', 'Engineering', 'Support'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.membershipId.trim()) newErrors.membershipId = 'Membership ID is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.address.street.trim()) newErrors['address.street'] = 'Street address is required';
    if (!formData.address.city.trim()) newErrors['address.city'] = 'City is required';
    if (!formData.address.state.trim()) newErrors['address.state'] = 'State is required';
    if (!formData.address.postalCode.trim()) newErrors['address.postalCode'] = 'Postal code is required';
    if (!formData.nic.trim()) newErrors.nic = 'NIC is required';
    if (!formData.division) newErrors.division = 'Division is required';
    
    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }
    
    if (formData.password && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one lowercase letter, one uppercase letter, and one number';
    }
    
    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Mobile validation
    if (formData.mobile && !/^[0-9]{10,15}$/.test(formData.mobile)) {
      newErrors.mobile = 'Please enter a valid mobile number (10-15 digits)';
    }
    
    // Age validation
    if (formData.dateOfBirth) {
      const age = Math.floor((Date.now() - new Date(formData.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000));
      if (age < 18) {
        newErrors.dateOfBirth = 'You must be at least 18 years old';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const userData = {
        ...formData,
        confirmPassword: undefined // Remove confirmPassword before sending
      };
      
      await register(userData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div style={{ maxWidth: '600px', margin: '0 auto', paddingTop: '2rem' }}>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title" style={{ textAlign: 'center' }}>
              Create Your Account
            </h2>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', margin: 0 }}>
              Join the Helios Voting System
            </p>
          </div>
          
          <form onSubmit={handleSubmit}>
            {/* Personal Information */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: 'var(--primary)', marginBottom: '1rem', borderBottom: '2px solid var(--light)', paddingBottom: '0.5rem' }}>
                Personal Information
              </h3>
              
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  className={`form-input ${errors.fullName ? 'error' : ''}`}
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
                {errors.fullName && <div className="form-error">{errors.fullName}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Membership ID *</label>
                <input
                  type="text"
                  name="membershipId"
                  className={`form-input ${errors.membershipId ? 'error' : ''}`}
                  placeholder="Enter your membership ID"
                  value={formData.membershipId}
                  onChange={handleInputChange}
                />
                {errors.membershipId && <div className="form-error">{errors.membershipId}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && <div className="form-error">{errors.email}</div>}
              </div>

              <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Password *</label>
                  <input
                    type="password"
                    name="password"
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  {errors.password && <div className="form-error">{errors.password}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm Password *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                  {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: 'var(--primary)', marginBottom: '1rem', borderBottom: '2px solid var(--light)', paddingBottom: '0.5rem' }}>
                Contact Information
              </h3>
              
              <div className="form-group">
                <label className="form-label">Mobile Number *</label>
                <input
                  type="tel"
                  name="mobile"
                  className={`form-input ${errors.mobile ? 'error' : ''}`}
                  placeholder="Enter your mobile number"
                  value={formData.mobile}
                  onChange={handleInputChange}
                />
                {errors.mobile && <div className="form-error">{errors.mobile}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Date of Birth *</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  className={`form-input ${errors.dateOfBirth ? 'error' : ''}`}
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                />
                {errors.dateOfBirth && <div className="form-error">{errors.dateOfBirth}</div>}
              </div>
            </div>

            {/* Address */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: 'var(--primary)', marginBottom: '1rem', borderBottom: '2px solid var(--light)', paddingBottom: '0.5rem' }}>
                Address
              </h3>
              
              <div className="form-group">
                <label className="form-label">Street Address *</label>
                <input
                  type="text"
                  name="address.street"
                  className={`form-input ${errors['address.street'] ? 'error' : ''}`}
                  placeholder="Enter your street address"
                  value={formData.address.street}
                  onChange={handleInputChange}
                />
                {errors['address.street'] && <div className="form-error">{errors['address.street']}</div>}
              </div>

              <div className="grid grid-cols-3" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    name="address.city"
                    className={`form-input ${errors['address.city'] ? 'error' : ''}`}
                    placeholder="City"
                    value={formData.address.city}
                    onChange={handleInputChange}
                  />
                  {errors['address.city'] && <div className="form-error">{errors['address.city']}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">State *</label>
                  <input
                    type="text"
                    name="address.state"
                    className={`form-input ${errors['address.state'] ? 'error' : ''}`}
                    placeholder="State"
                    value={formData.address.state}
                    onChange={handleInputChange}
                  />
                  {errors['address.state'] && <div className="form-error">{errors['address.state']}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Postal Code *</label>
                  <input
                    type="text"
                    name="address.postalCode"
                    className={`form-input ${errors['address.postalCode'] ? 'error' : ''}`}
                    placeholder="Postal Code"
                    value={formData.address.postalCode}
                    onChange={handleInputChange}
                  />
                  {errors['address.postalCode'] && <div className="form-error">{errors['address.postalCode']}</div>}
                </div>
              </div>
            </div>

            {/* Verification */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: 'var(--primary)', marginBottom: '1rem', borderBottom: '2px solid var(--light)', paddingBottom: '0.5rem' }}>
                Verification
              </h3>
              
              <div className="form-group">
                <label className="form-label">NIC Number *</label>
                <input
                  type="text"
                  name="nic"
                  className={`form-input ${errors.nic ? 'error' : ''}`}
                  placeholder="Enter your NIC number"
                  value={formData.nic}
                  onChange={handleInputChange}
                />
                {errors.nic && <div className="form-error">{errors.nic}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Division *</label>
                <select
                  name="division"
                  className={`form-input ${errors.division ? 'error' : ''}`}
                  value={formData.division}
                  onChange={handleInputChange}
                >
                  <option value="">Select your division</option>
                  {divisions.map(division => (
                    <option key={division} value={division}>
                      {division}
                    </option>
                  ))}
                </select>
                {errors.division && <div className="form-error">{errors.division}</div>}
              </div>
            </div>

            <div className="form-group">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%' }}
              >
                {loading ? <span className="spinner"></span> : 'Create Account'}
              </button>
            </div>
          </form>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
