# 🚀 Quick Setup Guide - Helios Online Voting System

This guide will help you get the Helios Online Voting System up and running in minutes.

---

## ⚡ Quick Start (3 Steps)

### Step 1: Start Database Services

```bash
docker-compose up -d
```

This starts PostgreSQL and Redis in Docker containers.

### Step 2: Setup Backend

```bash
cd backend
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Backend will run on `http://localhost:5000`

### Step 3: Setup Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend will run on `http://localhost:5173`

---

## 🎯 Test Credentials

After seeding the database, you can login with:

**Chairman Account:**
- NIC: `199012345678`
- Password: `password123`

**Secretary Account:**
- NIC: `199123456789`
- Password: `password123`

**Voter Accounts:**
- NIC: `199300000001` to `199300000010`
- Password: `password123`

---

## 📝 Detailed Setup Instructions

### Prerequisites

Ensure you have installed:
- Node.js v20+
- Docker & Docker Compose
- Git

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd Helios-Online-Voting-System
```

### 2. Environment Setup

**Backend (.env):**
```env
NODE_ENV=development
PORT=5000
DATABASE_URL="postgresql://voting_user:voting_password@localhost:5432/voting_db"
REDIS_URL="redis://localhost:6379"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-refresh-token-secret-change-this
CORS_ORIGIN=http://localhost:5173
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 3. Database Setup

```bash
# Start PostgreSQL & Redis
docker-compose up -d

# Check they're running
docker ps

# Access Adminer (Database GUI) at http://localhost:8080
# Server: postgres
# Username: voting_user
# Password: voting_password
# Database: voting_db
```

### 4. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Generate Prisma Client (creates TypeScript types)
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed database with sample data
npm run prisma:seed

# Start development server
npm run dev
```

Backend API: `http://localhost:5000`
API Health Check: `http://localhost:5000/api/health`

### 5. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend App: `http://localhost:5173`

---

## 🧪 Testing the Application

### 1. Register a New Organization

1. Go to `http://localhost:5173`
2. Click "Register"
3. Fill in:
   - NIC: `200012345678`
   - Password: `test123`
   - Name: `Test User`
   - Phone: `+94771234567`
   - Organization: `Test Org`
4. Submit - You'll be logged in as Chairman

### 2. Login with Seeded Data

1. Go to `http://localhost:5173`
2. Enter NIC: `199012345678`
3. Enter Password: `password123`
4. Click Login

### 3. Test Different Roles

**Chairman Dashboard:**
- Create elections
- Manage users
- Assign roles
- Delete elections
- Publish results

**Voter Dashboard:**
- View active elections
- Cast votes
- View results (if published)

---

## 🐳 Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Remove all data (WARNING: deletes database)
docker-compose down -v
```

---

## 📦 Build for Production

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm run build
npm run preview
```

Production build will be in `frontend/dist/`

---

## 🔧 Troubleshooting

### Port Already in Use

```bash
# Check what's using port 5000 (backend)
lsof -i :5000

# Check what's using port 5173 (frontend)
lsof -i :5173

# Kill process
kill -9 <PID>
```

### Database Connection Error

```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Restart PostgreSQL
docker-compose restart postgres

# Check logs
docker-compose logs postgres
```

### Redis Connection Error

```bash
# Check if Redis is running
docker ps | grep redis

# Restart Redis
docker-compose restart redis
```

### Prisma Issues

```bash
# Regenerate Prisma Client
cd backend
npm run prisma:generate

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# View database in Prisma Studio
npx prisma studio
```

### Frontend Not Loading

```bash
# Clear node_modules and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
```

---

## 📚 API Testing

### Using cURL

```bash
# Health Check
curl http://localhost:5000/api/health

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nic": "200012345678",
    "password": "test123",
    "name": "Test User",
    "phone": "+94771234567",
    "organizationName": "Test Org"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "nic": "199012345678",
    "password": "password123"
  }'
```

### Using Postman/Insomnia

Import the API endpoints from the README.md

---

## 🎓 Learning Resources

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

### Prisma
- [Prisma Docs](https://www.prisma.io/docs)
- [Prisma TypeScript](https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/use-custom-model-and-field-names)

### React
- [React Docs](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [Zustand](https://github.com/pmndrs/zustand)

---

## 🚀 Next Steps

1. ✅ Complete the setup
2. ✅ Test with seeded data
3. ✅ Explore the codebase
4. ✅ Create your first election
5. ✅ Cast votes
6. ✅ View results
7. 📝 Customize for your needs
8. 🚀 Deploy to production

---

## 💡 Tips

- Use `npm run prisma:studio` to view/edit database
- Check backend logs for errors
- Use browser DevTools to debug frontend
- Socket.io events can be monitored in Network tab
- All passwords in seed data are `password123`

---

## 📞 Need Help?

- Check the main [README.md](README.md)
- Review the code comments
- Check console logs (backend and frontend)
- Review Prisma schema at `backend/prisma/schema.prisma`

---

**Happy Coding! 🗳️**
