# 📥 Installation Instructions - Helios Online Voting System

## 🎯 Complete Installation Guide

Follow these steps to get the Helios Online Voting System running on your machine.

---

## ✅ Prerequisites Check

Before starting, verify you have:

```bash
# Check Node.js version (should be v20+)
node --version

# Check npm version
npm --version

# Check Docker version
docker --version

# Check Docker Compose version
docker-compose --version

# Check Git version
git --version
```

If any are missing, install them first:
- **Node.js**: https://nodejs.org/ (Download LTS version)
- **Docker Desktop**: https://www.docker.com/products/docker-desktop/
- **Git**: https://git-scm.com/downloads

---

## 📦 Step 1: Clone or Download

If you cloned from Git:
```bash
cd Helios-Online-Voting-System
```

If you downloaded as ZIP:
```bash
# Extract the ZIP file
cd Helios-Online-Voting-System
```

---

## 🐳 Step 2: Start Docker Services

```bash
# Start PostgreSQL, Redis, and Adminer
docker-compose up -d

# Verify containers are running
docker ps

# You should see:
# - voting_postgres (PostgreSQL)
# - voting_redis (Redis)
# - voting_adminer (Database GUI)
```

**Verify Services:**
- PostgreSQL: Running on port 5432
- Redis: Running on port 6379
- Adminer: Open http://localhost:8080 in browser

---

## 🔧 Step 3: Backend Setup

### 3.1 Install Dependencies

```bash
cd backend
npm install
```

This will install:
- Express.js
- Prisma
- TypeScript
- Socket.io
- JWT, bcrypt, and all other dependencies

### 3.2 Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env file (optional for local dev)
# The default values work for local development
```

**Important**: For production, change:
- `JWT_SECRET` to a strong random string
- `JWT_REFRESH_SECRET` to another strong random string
- `DATABASE_URL` to your production database
- `REDIS_URL` to your production Redis

### 3.3 Setup Database

```bash
# Generate Prisma Client (creates TypeScript types)
npm run prisma:generate

# Run database migrations (creates tables)
npm run prisma:migrate

# Seed database with sample data
npm run prisma:seed
```

**What gets seeded:**
- 1 Demo Organization
- 1 Chairman user
- 1 Secretary user
- 1 Executive user
- 10 Voter users
- 2 Sample elections (1 active, 1 completed with results)

### 3.4 Start Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# You should see:
# ✅ Database connected successfully
# ✅ Redis connected successfully
# ✅ Socket.io initialized successfully
# Server running on http://localhost:5000
```

**Test the backend:**
```bash
curl http://localhost:5000/api/health
```

You should get:
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "..."
}
```

---

## 🎨 Step 4: Frontend Setup

### 4.1 Install Dependencies

Open a **new terminal** (keep backend running):

```bash
cd frontend
npm install
```

This will install:
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Zustand
- Socket.io Client
- All UI dependencies

### 4.2 Configure Environment

```bash
# Copy example env file
cp .env.example .env

# The defaults work for local development
# No need to edit unless you changed backend port
```

### 4.3 Start Frontend Server

```bash
# Development mode (with hot reload)
npm run dev

# You should see:
# VITE ready in XXX ms
# Local:   http://localhost:5173/
```

**Open your browser:**
```
http://localhost:5173
```

You should see the Helios Voting System login page!

---

## 🧪 Step 5: Test the Application

### 5.1 Login with Seeded Data

**Chairman Account:**
- NIC: `199012345678`
- Password: `password123`

**Secretary Account:**
- NIC: `199123456789`
- Password: `password123`

**Voter Account:**
- NIC: `199300000001` (or 002, 003, ... up to 010)
- Password: `password123`

### 5.2 Test Features

**As Chairman:**
1. ✅ View dashboard with statistics
2. ✅ Go to "Elections" → See sample elections
3. ✅ Create a new election
4. ✅ Add candidates
5. ✅ Start an election
6. ✅ Go to "Users" → See all users
7. ✅ Assign roles to users

**As Voter:**
1. ✅ View active elections
2. ✅ Click on an election
3. ✅ Vote for a candidate
4. ✅ See confirmation
5. ✅ View results (if published)

### 5.3 Test Real-time Updates

1. Open two browser windows
2. Login as Chairman in window 1
3. Login as Voter in window 2
4. Cast a vote in window 2
5. See live updates in window 1 (vote count increases)

---

## ✅ Verify Everything Works

### Backend Checklist:
- [ ] PostgreSQL running (check `docker ps`)
- [ ] Redis running (check `docker ps`)
- [ ] Backend server started (`npm run dev`)
- [ ] API responding at http://localhost:5000/api/health
- [ ] No errors in backend console

### Frontend Checklist:
- [ ] Frontend server started (`npm run dev`)
- [ ] Page loads at http://localhost:5173
- [ ] Can see login page
- [ ] Can login with test credentials
- [ ] Dashboard loads
- [ ] No errors in browser console

---

## 🔍 Troubleshooting

### Issue: "Port already in use"

```bash
# Windows
netstat -ano | findstr :5000
netstat -ano | findstr :5173

# Kill process
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

### Issue: "Cannot connect to database"

```bash
# Check if PostgreSQL container is running
docker ps | grep postgres

# If not running
docker-compose up -d postgres

# Check logs
docker-compose logs postgres
```

### Issue: "Cannot connect to Redis"

```bash
# Check if Redis container is running
docker ps | grep redis

# If not running
docker-compose up -d redis

# Test Redis
docker exec -it voting_redis redis-cli ping
# Should return: PONG
```

### Issue: "Prisma errors"

```bash
cd backend

# Regenerate Prisma Client
npm run prisma:generate

# If migrations fail
npx prisma migrate reset  # WARNING: Deletes all data

# Then re-run
npm run prisma:migrate
npm run prisma:seed
```

### Issue: "Frontend won't start"

```bash
cd frontend

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite

# Try again
npm run dev
```

### Issue: "TypeScript errors"

```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build

# Fix errors shown in console
```

---

## 🎓 Next Steps

After successful installation:

1. **Explore the codebase:**
   - Backend: `backend/src/`
   - Frontend: `frontend/src/`
   - Database: `backend/prisma/schema.prisma`

2. **Read documentation:**
   - README.md - Full documentation
   - SETUP.md - Quick start guide
   - PROJECT_SUMMARY.md - What's built

3. **Customize:**
   - Change branding/colors in `frontend/tailwind.config.ts`
   - Add organization logo
   - Modify election types
   - Add custom fields

4. **Deploy:**
   - Build for production
   - Deploy to cloud
   - Setup domain
   - Configure SSL

---

## 📚 Useful Commands

### Backend Commands:
```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server
npm run prisma:studio    # Open database GUI
npm run prisma:migrate   # Run migrations
npm run prisma:seed      # Seed database
npm test                 # Run tests
```

### Frontend Commands:
```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run linter
```

### Docker Commands:
```bash
docker-compose up -d           # Start all services
docker-compose down            # Stop all services
docker-compose restart         # Restart services
docker-compose logs -f         # View logs
docker-compose down -v         # Remove all data (careful!)
```

---

## 🎉 Success!

If you've completed all steps and tests pass, congratulations! 🎊

You now have a fully functional online voting system running locally.

**What you can do now:**
- Create elections
- Add candidates
- Manage users
- Cast votes
- View real-time results
- Test all features

**Need help?**
- Check the README.md
- Review code comments
- Check browser/server console for errors

---

## 🚀 Production Deployment

Ready to deploy? Check out:
- README.md - Deployment section
- Build both frontend and backend
- Setup production database
- Configure environment variables
- Setup SSL certificates
- Deploy to your preferred platform

---

**Happy Voting! 🗳️**
