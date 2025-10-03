# 🗳️ Helios Online Voting System

A secure, full-featured online voting platform built with **TypeScript**, **React**, **Node.js**, **PostgreSQL**, and **Redis**. Perfect for organizations to conduct elections, AGMs, committee selections, and more.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [User Roles](#user-roles)
- [Security Features](#security-features)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### 🔐 Authentication & Security
- **Multi-factor authentication** (NIC + Password + OTP)
- **JWT-based authentication** with refresh tokens
- **Role-based access control** (RBAC)
- **Password hashing** with bcrypt
- **Rate limiting** to prevent abuse
- **CORS & Helmet** security headers

### 🗳️ Voting System
- **Single choice, multiple choice, and ranked voting**
- **Anonymous voting** (votes not linked to user identity)
- **One vote per user** per election (database-enforced)
- **Real-time vote counting** with Socket.io
- **Vote confirmation** before submission
- **Audit trail** (who voted when, but not for whom)

### 📊 Election Management
- **Create and manage elections**
- **Add candidates** with photos and descriptions
- **Schedule elections** (auto-start/end based on dates)
- **Draft, scheduled, active, closed, published** statuses
- **Automatic election lifecycle** with cron jobs
- **Election statistics** and participation rates

### 👥 User Management
- **Multi-tenant** (organization-based)
- **User roles:** Chairman, Secretary, Executive, Voter
- **Activate/deactivate users**
- **Search and filter** users
- **Custom user fields** per organization

### 📈 Results & Analytics
- **Automatic result calculation**
- **Charts and visualizations** (Recharts)
- **Winner determination**
- **Participation rate** tracking
- **Export results** (PDF/Excel - planned)
- **Real-time results updates** via WebSocket

### 📱 Progressive Web App (PWA)
- **Installable** on mobile/desktop
- **Offline support** with service worker
- **Mobile-first design**
- **Responsive UI** (Tailwind CSS)
- **Touch-optimized** buttons and interactions

### 🔔 Real-time Features
- **Live vote counting**
- **Election status change** notifications
- **New election** announcements
- **Results updates** in real-time
- **Socket.io** with TypeScript

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router v6** - Routing
- **Zustand** - State management
- **React Hook Form + Yup** - Forms & validation
- **Recharts** - Charts
- **Socket.io Client** - Real-time
- **Framer Motion** - Animations
- **React Hot Toast** - Notifications
- **Workbox** - PWA/Service Worker

### Backend
- **Node.js 20 LTS** - Runtime
- **Express.js 4** - Web framework
- **TypeScript** - Type safety
- **Prisma** - ORM (with TypeScript types)
- **PostgreSQL 15+** - Primary database
- **Redis 7+** - Cache/sessions/queue
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Bull** - Job queue
- **Winston** - Logging
- **Helmet + CORS** - Security
- **Node-cron** - Scheduled tasks

### DevOps & Tools
- **Docker** - Containerization
- **Docker Compose** - Multi-container setup
- **ESLint** - Code linting
- **Prettier** - Code formatting (optional)

---

## 📁 Project Structure

```
Helios-Online-Voting-System/
├── backend/                    # Node.js TypeScript API
│   ├── src/
│   │   ├── config/            # Database, Redis, Socket.io, env
│   │   ├── types/             # TypeScript types & interfaces
│   │   ├── middleware/        # Auth, validation, error handling
│   │   ├── controllers/       # Route controllers
│   │   ├── services/          # Business logic
│   │   ├── routes/            # API routes
│   │   ├── validators/        # Input validation
│   │   ├── utils/             # Helpers, JWT, encryption, logger
│   │   ├── jobs/              # Background jobs (Bull)
│   │   ├── sockets/           # Socket.io handlers
│   │   ├── app.ts             # Express app
│   │   └── server.ts          # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   ├── migrations/        # DB migrations
│   │   └── seed.ts            # Seed data
│   ├── tests/                 # Tests
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/                  # React TypeScript App
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── auth/         # Login, Register, OTP
│   │   │   ├── admin/        # Admin dashboard, user management
│   │   │   ├── elections/    # Election list, details
│   │   │   ├── voting/       # Voting interface, candidates
│   │   │   ├── results/      # Results, charts
│   │   │   ├── shared/       # Reusable components (Button, Input, etc.)
│   │   │   └── layout/       # Header, Sidebar, Layout
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   ├── store/            # Zustand stores
│   │   ├── types/            # TypeScript types
│   │   ├── utils/            # Helper functions
│   │   ├── hooks/            # Custom hooks
│   │   ├── routes/           # Route configuration
│   │   ├── App.tsx           # Main app
│   │   ├── main.tsx          # Entry point
│   │   └── index.css         # Global styles
│   ├── public/               # Static assets
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── .env.example
│
├── docker-compose.yml         # PostgreSQL + Redis
├── .gitignore
└── README.md
```

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20 LTS or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Docker** & **Docker Compose** - [Download](https://www.docker.com/products/docker-desktop/)
- **Git** - [Download](https://git-scm.com/)

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/Helios-Online-Voting-System.git
cd Helios-Online-Voting-System
```

### 2. Start Docker services (PostgreSQL + Redis)

```bash
docker-compose up -d
```

This will start:
- PostgreSQL on `localhost:5432`
- Redis on `localhost:6379`
- Adminer (DB GUI) on `localhost:8080`

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration (JWT secrets, etc.)

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# (Optional) Seed database with sample data
npm run prisma:seed
```

### 4. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env if needed (API URL)
```

---

## ▶️ Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5173`

### Production Build

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

---

## 📡 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user & organization | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/send-otp` | Request OTP | No |
| POST | `/api/auth/verify-otp` | Verify OTP code | No |
| POST | `/api/auth/refresh-token` | Refresh access token | No |
| POST | `/api/auth/logout` | Logout user | Yes |
| GET | `/api/auth/me` | Get current user | Yes |

### User Management Endpoints

| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| GET | `/api/users` | Get all users | Any |
| GET | `/api/users/:id` | Get user by ID | Any |
| PUT | `/api/users/:id/role` | Update user role | Chairman |
| PUT | `/api/users/:id/status` | Toggle user status | Secretary+ |
| PUT | `/api/users/:id` | Update profile | Self |
| DELETE | `/api/users/:id` | Delete user | Chairman |
| GET | `/api/users/stats` | Get user statistics | Any |

### Election Endpoints

| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| GET | `/api/elections` | Get all elections | Any |
| GET | `/api/elections/:id` | Get election details | Any |
| POST | `/api/elections` | Create election | Secretary+ |
| PUT | `/api/elections/:id` | Update election | Secretary+ |
| DELETE | `/api/elections/:id` | Delete election | Chairman |
| POST | `/api/elections/:id/start` | Start election | Secretary+ |
| POST | `/api/elections/:id/close` | Close election | Secretary+ |
| POST | `/api/elections/:id/publish` | Publish results | Chairman |
| GET | `/api/elections/:id/can-vote` | Check if user can vote | Voter |

### Voting Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/votes/elections/:id/vote` | Cast vote | Yes |
| GET | `/api/votes/elections/:id/my-vote` | Check if voted | Yes |
| GET | `/api/votes/my-votes` | Get vote history | Yes |

### Results Endpoints

| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| GET | `/api/results/elections/:id/results` | Get results | Depends on status |
| POST | `/api/results/elections/:id/results/calculate` | Calculate results | Secretary+ |
| GET | `/api/results/elections/:id/stats` | Get statistics | Any |

---

## 🔧 Environment Variables

### Backend (.env)

```env
NODE_ENV=development
PORT=5000

# Database (PostgreSQL)
DATABASE_URL="postgresql://voting_user:voting_password@localhost:5432/voting_db"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-token-secret-change-this
JWT_REFRESH_EXPIRES_IN=30d

# OTP
OTP_EXPIRY_MINUTES=5

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## 🗄️ Database Schema

Key models in the PostgreSQL database:

- **Organization** - Multi-tenant organizations
- **User** - Users with roles (Chairman, Secretary, Executive, Voter)
- **OTP** - OTP codes for verification
- **Election** - Elections with status, dates, settings
- **Candidate** - Candidates in elections
- **Vote** - Anonymous votes (one per user per election)
- **Result** - Calculated election results
- **AuditLog** - Audit trail for security
- **RefreshToken** - JWT refresh tokens

See `backend/prisma/schema.prisma` for full schema.

---

## 👤 User Roles

| Role | Permissions |
|------|-------------|
| **Chairman** | Full access - create elections, manage users, assign roles, delete elections |
| **Secretary** | Create elections, manage voters, view results |
| **Executive** | View elections, monitor participation |
| **Voter** | Vote in elections, view own voting history |

The first user to register becomes the **Chairman** of their organization.

---

## 🔒 Security Features

✅ **Password hashing** with bcrypt (10 rounds)
✅ **JWT authentication** with access & refresh tokens
✅ **OTP verification** for additional security
✅ **Rate limiting** on sensitive endpoints
✅ **CORS** configuration
✅ **Helmet** security headers
✅ **SQL injection prevention** (Prisma ORM)
✅ **XSS protection**
✅ **Input validation** on all endpoints
✅ **Anonymous voting** - votes not linked to user identity
✅ **Audit logging** for accountability
✅ **Type safety** with TypeScript

---

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests (if configured)
cd frontend
npm test
```

---

## 📦 Deployment

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d --build
```

### Manual Deployment

1. Build backend: `cd backend && npm run build`
2. Build frontend: `cd frontend && npm run build`
3. Deploy `backend/dist` to Node.js server
4. Deploy `frontend/dist` to static hosting (Vercel, Netlify, etc.)
5. Ensure PostgreSQL and Redis are accessible
6. Set production environment variables

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Contact: [your-email@example.com](mailto:your-email@example.com)

---

## 🎯 Roadmap

- [ ] Email notifications
- [ ] SMS integration (Twilio)
- [ ] Export results to PDF/Excel
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Mobile apps (React Native)

---

## 🙏 Acknowledgments

- Built with ❤️ using TypeScript
- Powered by PostgreSQL & Redis
- UI designed with Tailwind CSS
- Real-time updates via Socket.io

---

**Happy Voting! 🗳️**
