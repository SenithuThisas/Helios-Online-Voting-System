# 🗳️ Helios Online Voting System

A secure, full-stack web application for trade union online voting built with the MERN stack (MongoDB, Express, React, Node.js).

## ✨ Features

### 🔐 Authentication & Security
- **Secure User Registration** with comprehensive validation
- **Two-Factor Authentication** using OTP (One-Time Password)
- **JWT-based Authentication** with secure token management
- **Password Hashing** using bcrypt with configurable rounds
- **Role-based Access Control** (Voter/Admin)

### 🗳️ Voting System
- **Election Management** with start/end dates and status tracking
- **Candidate Profiles** with manifestos and experience details
- **Secure Voting** with one vote per user per election
- **Real-time Results** for completed elections
- **Voting History** with detailed audit trail

### 👥 User Management
- **Comprehensive User Profiles** with all required fields
- **Division-based Access** control for elections
- **User Status Management** (Active/Inactive)
- **Profile Updates** and management

### 🛠️ Admin Features
- **Dashboard Analytics** with system statistics
- **Election Creation** and management
- **Candidate Management** and oversight
- **User Administration** and monitoring
- **Detailed Reports** and audit trails

### 🎨 User Interface
- **Responsive Design** optimized for all devices
- **Unified Color Theme** using the specified color palette
- **Modern UI Components** with smooth animations
- **Intuitive Navigation** and user experience

## 🎨 Color Theme

The application uses a carefully selected color palette for a professional and harmonious interface:

- **Primary**: `#3D52A0` - Main brand color for headers and primary actions
- **Secondary**: `#7091E6` - Secondary actions and highlights
- **Accent**: `#8697C4` - Accent elements and borders
- **Light**: `#ADBBDA` - Light backgrounds and subtle elements
- **Background**: `#EDE8F5` - Main background color

## 🏗️ Project Structure

```
helios-online-voting-system/
├── 📁 Backend
│   ├── 📁 models/           # Mongoose data models
│   ├── 📁 routes/           # Express API routes
│   ├── 📁 middleware/       # Authentication & validation
│   ├── 📁 utils/            # Utility functions
│   ├── 📄 server.js         # Main server file
│   └── 📄 package.json      # Backend dependencies
├── 📁 client/               # React frontend
│   ├── 📁 public/           # Static assets
│   ├── 📁 src/
│   │   ├── 📁 components/   # Reusable UI components
│   │   ├── 📁 pages/        # Page components
│   │   ├── 📁 contexts/     # React contexts
│   │   ├── 📁 utils/        # Frontend utilities
│   │   ├── 📄 App.js        # Main app component
│   │   └── 📄 index.js      # Entry point
│   └── 📄 package.json      # Frontend dependencies
├── 📄 package.json          # Root package.json
├── 📄 env.example           # Environment variables template
└── 📄 README.md             # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (v5 or higher)
- **npm** or **yarn** package manager

### 1. Clone the Repository

```bash
git clone <repository-url>
cd helios-online-voting-system
```

### 2. Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
npm run install-client
```

### 3. Environment Setup

```bash
# Copy environment template
cp env.example .env

# Edit .env file with your configuration
nano .env
```

**Required Environment Variables:**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/helios_voting_system
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=24h
BCRYPT_ROUNDS=12
```

### 4. Start MongoDB

```bash
# Start MongoDB service
mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 5. Run the Application

```bash
# Development mode (both backend and frontend)
npm run dev

# Or run separately:
# Backend only
npm run server

# Frontend only (in another terminal)
npm run client
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login (generates OTP)
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/resend-otp` - Resend OTP
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/logout` - User logout

### Voting
- `GET /api/vote/elections` - Get available elections
- `GET /api/vote/elections/:id` - Get election details
- `GET /api/vote/elections/:id/candidates` - Get election candidates
- `POST /api/vote/elections/:id/vote` - Submit vote
- `GET /api/vote/my-votes` - Get user's voting history
- `GET /api/vote/elections/:id/results` - Get election results

### Admin
- `GET /api/admin/dashboard` - Admin dashboard statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/status` - Update user status
- `POST /api/admin/elections` - Create election
- `PUT /api/admin/elections/:id` - Update election
- `DELETE /api/admin/elections/:id` - Delete election
- `POST /api/admin/candidates` - Create candidate
- `PUT /api/admin/candidates/:id` - Update candidate
- `DELETE /api/admin/candidates/:id` - Delete candidate

## 🔧 Configuration

### MongoDB Connection
The application connects to MongoDB using the `MONGODB_URI` environment variable. Ensure MongoDB is running and accessible.

### JWT Configuration
- **JWT_SECRET**: A strong, unique secret key for JWT signing
- **JWT_EXPIRE**: Token expiration time (default: 24h)

### Security Settings
- **BCRYPT_ROUNDS**: Password hashing rounds (default: 12)
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Helmet**: Security headers and protection

## 🧪 Testing

### Backend Testing
```bash
# Run backend tests
npm test

# Run with coverage
npm run test:coverage
```

### Frontend Testing
```bash
cd client
npm test

# Run with coverage
npm run test:coverage
```

## 🚀 Deployment

### Production Build
```bash
# Build frontend for production
npm run build

# Start production server
npm start
```

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
JWT_EXPIRE=24h
BCRYPT_ROUNDS=12
```

### Docker Deployment
```dockerfile
# Example Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

## 🔒 Security Features

- **Password Hashing**: Bcrypt with configurable rounds
- **JWT Authentication**: Secure token-based authentication
- **OTP Verification**: Two-factor authentication for login
- **Input Validation**: Comprehensive request validation
- **Rate Limiting**: Protection against brute force attacks
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet Security**: Security headers and protection

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured interface with advanced layouts
- **Tablet**: Optimized for touch and medium screens
- **Mobile**: Mobile-first design with touch-friendly controls

## 🛠️ Development

### Code Style
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Husky**: Git hooks for code quality

### Adding New Features
1. Create feature branch: `git checkout -b feature/new-feature`
2. Implement changes following existing patterns
3. Add tests for new functionality
4. Update documentation
5. Submit pull request

### Database Migrations
The application uses Mongoose schemas with automatic indexing. For schema changes:
1. Update the model file
2. Test with existing data
3. Consider data migration scripts for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## 🔮 Future Enhancements

- **Email Integration**: Real OTP delivery via email
- **SMS Integration**: OTP delivery via SMS
- **Advanced Analytics**: Detailed voting analytics and reports
- **Multi-language Support**: Internationalization
- **Mobile App**: Native mobile applications
- **Blockchain Integration**: Enhanced vote verification
- **Real-time Updates**: WebSocket integration for live results

## 📊 System Requirements

### Minimum Requirements
- **Node.js**: v16.0.0+
- **MongoDB**: v5.0.0+
- **RAM**: 2GB+
- **Storage**: 1GB+

### Recommended Requirements
- **Node.js**: v18.0.0+
- **MongoDB**: v6.0.0+
- **RAM**: 4GB+
- **Storage**: 5GB+

---

**Built with ❤️ for secure and transparent democratic processes**
