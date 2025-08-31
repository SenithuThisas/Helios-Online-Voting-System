import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { currentUser, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: currentUser?.name?.split(' ')[0] || '',
    lastName: currentUser?.name?.split(' ').slice(1).join(' ') || '',
    email: currentUser?.email || '',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1995-06-15',
    address: '123 Main Street, City, State 12345',
    notifications: {
      email: true,
      sms: false,
      push: true
    }
  });

  const [errors, setErrors] = useState({});

  // Mock data for user stats
  const userStats = {
    totalElections: 15,
    electionsVoted: 12,
    participationRate: 80,
    lastVote: '2024-03-16',
    memberSince: '2023-09-01'
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Simulate API call to update profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user data
      const updatedUser = {
        ...currentUser,
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email
      };
      
      updateUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleNotificationChange = (type) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type]
      }
    }));
  };

  const handleCancel = () => {
    setFormData({
      firstName: currentUser?.name?.split(' ')[0] || '',
      lastName: currentUser?.name?.split(' ').slice(1).join(' ') || '',
      email: currentUser?.email || '',
      phone: '+1 (555) 123-4567',
      dateOfBirth: '1995-06-15',
      address: '123 Main Street, City, State 12345',
      notifications: {
        email: true,
        sms: false,
        push: true
      }
    });
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Profile</h1>
          <p className="text-gray-600">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {currentUser?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{currentUser?.name || 'User'}</h2>
                <p className="text-gray-500">{currentUser?.email}</p>
                <span className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium mt-2">
                  {currentUser?.role || 'Voter'}
                </span>
              </div>

              <div className="border-t border-light pt-6">
                <h3 className="text-lg font-semibold text-primary mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Elections</span>
                    <span className="font-semibold text-primary">{userStats.totalElections}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Elections Voted</span>
                    <span className="font-semibold text-secondary">{userStats.electionsVoted}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Participation Rate</span>
                    <span className="font-semibold text-accent">{userStats.participationRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Last Vote</span>
                    <span className="font-semibold text-gray-700">
                      {new Date(userStats.lastVote).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Member Since</span>
                    <span className="font-semibold text-gray-700">
                      {new Date(userStats.memberSince).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-primary">Personal Information</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-primary"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex space-x-3">
                    <button
                      onClick={handleCancel}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="btn-primary"
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                    />
                    {errors.firstName && (
                      <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                    />
                    {errors.lastName && (
                      <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                    />
                  </div>

                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows={3}
                    className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                  />
                </div>

                {/* Notification Preferences */}
                <div className="border-t border-light pt-6">
                  <h4 className="text-lg font-semibold text-primary mb-4">Notification Preferences</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Email Notifications</p>
                        <p className="text-sm text-gray-500">Receive updates via email</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleNotificationChange('email')}
                        disabled={!isEditing}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          formData.notifications.email ? 'bg-primary' : 'bg-gray-200'
                        } ${!isEditing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData.notifications.email ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">SMS Notifications</p>
                        <p className="text-sm text-gray-500">Receive updates via text message</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleNotificationChange('sms')}
                        disabled={!isEditing}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          formData.notifications.sms ? 'bg-primary' : 'bg-gray-200'
                        } ${!isEditing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData.notifications.sms ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Push Notifications</p>
                        <p className="text-sm text-gray-500">Receive updates in the app</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleNotificationChange('push')}
                        disabled={!isEditing}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          formData.notifications.push ? 'bg-primary' : 'bg-gray-200'
                        } ${!isEditing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData.notifications.push ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Security Settings */}
            <div className="card mt-6">
              <h3 className="text-xl font-semibold text-primary mb-4">Security Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-light rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Change Password</p>
                    <p className="text-sm text-gray-500">Update your account password</p>
                  </div>
                  <button className="btn-secondary">
                    Change
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-light rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-500">Add an extra layer of security</p>
                  </div>
                  <button className="btn-secondary">
                    Enable
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-light rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Login History</p>
                    <p className="text-sm text-gray-500">View your recent login activity</p>
                  </div>
                  <button className="btn-secondary">
                    View
                  </button>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="card mt-6">
              <h3 className="text-xl font-semibold text-primary mb-4">Account Actions</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-light rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Export Data</p>
                    <p className="text-sm text-gray-500">Download your voting history and data</p>
                  </div>
                  <button className="btn-secondary">
                    Export
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                  <div>
                    <p className="font-medium text-red-900">Delete Account</p>
                    <p className="text-sm text-red-600">Permanently remove your account and data</p>
                  </div>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

