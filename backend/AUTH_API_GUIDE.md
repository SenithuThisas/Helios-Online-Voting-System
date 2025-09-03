# Helios Online Voting System - Authentication API Guide

## Overview
This guide explains how to use the authentication system with JWT tokens and MongoDB integration.

## Environment Setup

### 1. Create `.env` file in the backend directory:
```env
NODE_ENV=development
PORT=5000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/helios_voting_system
MONGODB_URI_PROD=mongodb+srv://username:password@cluster.mongodb.net/helios_voting_system

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_very_long_and_secure_123456789
JWT_EXPIRE=24h

# Password Hashing
BCRYPT_ROUNDS=12

# Email Configuration (for OTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# OTP Configuration
OTP_EXPIRE_MINUTES=5
```

### 2. Install dependencies:
```bash
cd backend
npm install
```

### 3. Start MongoDB:
```bash
# Make sure MongoDB is running on your system
mongod
```

### 4. Start the server:
```bash
npm run server
```

## API Endpoints

### 1. User Registration
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "fullName": "John Doe",
  "membershipId": "MEM001",
  "email": "john@example.com",
  "password": "SecurePass123",
  "mobile": "1234567890",
  "dateOfBirth": "1990-01-01",
  "address": {
    "street": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001"
  },
  "nic": "NIC123456789",
  "division": "IT"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "voter",
    "division": "IT"
  }
}
```

### 2. User Login
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "nic": "NIC123456789",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "message": "OTP sent successfully",
  "userId": "64f1a2b3c4d5e6f7g8h9i0j1",
  "otp": "123456",
  "expiresIn": "3 minutes"
}
```

### 3. OTP Verification
**POST** `/api/auth/verify-otp`

**Request Body:**
```json
{
  "userId": "64f1a2b3c4d5e6f7g8h9i0j1",
  "otp": "123456"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "voter",
    "division": "IT"
  }
}
```

### 4. Get Current User Profile
**GET** `/api/auth/me`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response:**
```json
{
  "user": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "fullName": "John Doe",
    "email": "john@example.com",
    "membershipId": "MEM001",
    "mobile": "1234567890",
    "role": "voter",
    "division": "IT",
    "isActive": true,
    "lastLogin": "2023-09-01T10:30:00.000Z",
    "createdAt": "2023-09-01T09:00:00.000Z",
    "updatedAt": "2023-09-01T10:30:00.000Z"
  }
}
```

### 5. Resend OTP
**POST** `/api/auth/resend-otp`

**Request Body:**
```json
{
  "userId": "64f1a2b3c4d5e6f7g8h9i0j1"
}
```

### 6. Logout
**POST** `/api/auth/logout`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

## Authentication Flow

1. **Registration**: User provides all required information and gets a JWT token immediately
2. **Login**: User provides email, NIC, and password → receives OTP
3. **OTP Verification**: User enters OTP → receives JWT token for authenticated access
4. **Protected Routes**: Include JWT token in Authorization header for protected endpoints

## Security Features

### Password Requirements:
- Minimum 8 characters
- At least one lowercase letter
- At least one uppercase letter
- At least one number

### JWT Token:
- Expires in 24 hours (configurable)
- Contains user ID
- Used for authentication on protected routes

### OTP System:
- 6-digit numeric code
- Expires in 3 minutes
- Required for login completion

### Role-Based Access:
- `voter`: Can vote in elections
- `executive`: Can manage elections
- `admin`: Full system access

## Testing the Authentication System

Run the test script to verify everything works:

```bash
cd backend
node test-auth.js
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400`: Bad Request (validation errors, invalid credentials)
- `401`: Unauthorized (invalid token, expired token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found (user not found)
- `500`: Internal Server Error

## Frontend Integration

### Storing JWT Token:
```javascript
// After successful login
localStorage.setItem('token', response.data.token);
```

### Making Authenticated Requests:
```javascript
const token = localStorage.getItem('token');
const response = await fetch('/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### Handling Token Expiration:
```javascript
if (response.status === 401) {
  localStorage.removeItem('token');
  // Redirect to login page
  window.location.href = '/login';
}
```

## Database Schema

### User Model:
- `fullName`: String (required)
- `membershipId`: String (required, unique)
- `email`: String (required, unique)
- `password`: String (required, hashed)
- `mobile`: String (required)
- `dateOfBirth`: Date (required)
- `address`: Object with street, city, state, postalCode
- `nic`: String (required, unique)
- `division`: String (required, enum)
- `role`: String (enum: voter, executive, admin)
- `isActive`: Boolean (default: true)
- `lastLogin`: Date
- `otp`: Object with code and expiresAt

## Production Considerations

1. **Environment Variables**: Use strong, unique JWT secrets
2. **HTTPS**: Always use HTTPS in production
3. **Rate Limiting**: Already implemented (100 requests per 15 minutes)
4. **Input Validation**: Comprehensive validation on all inputs
5. **Error Logging**: Implement proper logging for production
6. **Database Security**: Use MongoDB Atlas with proper security settings
7. **OTP Delivery**: Implement actual email/SMS delivery for OTP

## Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**: Ensure MongoDB is running and connection string is correct
2. **JWT Secret Error**: Make sure JWT_SECRET is set in environment variables
3. **Validation Errors**: Check that all required fields are provided with correct format
4. **Token Expired**: Tokens expire after 24 hours, user needs to login again

### Debug Mode:
Set `NODE_ENV=development` to see detailed error messages in development.
