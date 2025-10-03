# 🚀 Setup Without Docker - Windows Guide

## Quick Setup for Windows (No Docker Required)

Since Docker is not installed, we'll install PostgreSQL and Redis directly on Windows.

---

## 📥 Step 1: Install PostgreSQL

### Option A: Using PostgreSQL Installer (Recommended)

1. **Download PostgreSQL 15:**
   - Go to: https://www.postgresql.org/download/windows/
   - Download the latest PostgreSQL 15.x installer
   - Run the installer

2. **Installation Settings:**
   - Password: Set to `voting_password` (or remember your password)
   - Port: `5432` (default)
   - Locale: Default
   - Check "pgAdmin 4" (Database GUI tool)

3. **After Installation:**
   - PostgreSQL service should be running automatically
   - You can access pgAdmin at: http://localhost:5432

### Option B: Using Chocolatey (If you have it)

```powershell
choco install postgresql15
```

### Verify Installation:

```powershell
# Check PostgreSQL is running
Get-Service postgresql*

# Should show: Running
```

---

## 📥 Step 2: Install Redis

### Option A: Using Memurai (Redis for Windows)

1. **Download Memurai:**
   - Go to: https://www.memurai.com/get-memurai
   - Download Memurai (free Redis-compatible for Windows)
   - Install it

2. **Start Memurai:**
   - It should start automatically as a Windows service

### Option B: Using Redis on WSL2 (Advanced)

If you have WSL2:
```bash
wsl
sudo apt update
sudo apt install redis-server
sudo service redis-server start
```

### Verify Installation:

```powershell
# Test if Redis is running on port 6379
Test-NetConnection -ComputerName localhost -Port 6379
```

---

## 🗄️ Step 3: Create Database

### Using pgAdmin (GUI):

1. Open **pgAdmin 4** (installed with PostgreSQL)
2. Connect to PostgreSQL server
3. Right-click "Databases" → "Create" → "Database"
4. Database name: `voting_db`
5. Owner: `postgres`
6. Click "Save"

### Using Command Line:

```powershell
# Open PowerShell as Administrator
psql -U postgres

# In psql prompt:
CREATE DATABASE voting_db;
CREATE USER voting_user WITH ENCRYPTED PASSWORD 'voting_password';
GRANT ALL PRIVILEGES ON DATABASE voting_db TO voting_user;
\q
```

---

## 🔧 Step 4: Update Backend Configuration

### Edit Backend .env File:

```powershell
cd backend
notepad .env
```

**Update these lines:**

```env
NODE_ENV=development
PORT=5000

# PostgreSQL - Update if you used different credentials
DATABASE_URL="postgresql://postgres:voting_password@localhost:5432/voting_db"

# Redis - Default works if using Memurai
REDIS_URL="redis://localhost:6379"

# JWT Secrets
JWT_SECRET=my-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=my-refresh-token-secret
JWT_REFRESH_EXPIRES_IN=30d

# OTP
OTP_EXPIRY_MINUTES=5

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Save and close the file.**

---

## 🚀 Step 5: Run Backend

```powershell
cd backend

# Install dependencies
npm install

# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed database with sample data
npm run prisma:seed

# Start backend server
npm run dev
```

**You should see:**
```
✅ Database connected successfully
✅ Redis connected successfully
✅ Socket.io initialized successfully
Server running on http://localhost:5000
```

**Test it:**
```powershell
curl http://localhost:5000/api/health
```

---

## 🎨 Step 6: Run Frontend

**Open a NEW PowerShell window** (keep backend running):

```powershell
cd frontend

# Install dependencies
npm install

# Start frontend server
npm run dev
```

**You should see:**
```
VITE ready in XXX ms
Local:   http://localhost:5173/
```

**Open your browser:** http://localhost:5173

---

## 🧪 Step 7: Test the Application

### Login with Test Credentials:

**Chairman:**
- NIC: `199012345678`
- Password: `password123`

**Voter:**
- NIC: `199300000001`
- Password: `password123`

---

## 🔍 Troubleshooting

### Issue: PostgreSQL not running

```powershell
# Check service status
Get-Service postgresql*

# Start service if stopped
Start-Service postgresql-x64-15

# Or restart
Restart-Service postgresql-x64-15
```

### Issue: Redis/Memurai not running

```powershell
# Check Memurai service
Get-Service Memurai*

# Start if stopped
Start-Service Memurai

# Or restart
Restart-Service Memurai
```

### Issue: "Cannot connect to database"

**Check connection:**
```powershell
psql -U postgres -d voting_db
```

If this works, your database is fine. Update the `DATABASE_URL` in `.env`:

```env
# If using postgres user:
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/voting_db"
```

### Issue: Port 5000 already in use

```powershell
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Or change port in backend/.env
PORT=5001
```

### Issue: Port 5173 already in use

```powershell
# Find what's using port 5173
netstat -ano | findstr :5173

# Kill the process
taskkill /PID <PID> /F
```

### Issue: Prisma errors

```powershell
cd backend

# Reset everything (WARNING: deletes data)
npx prisma migrate reset

# Then regenerate
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

---

## 📊 Verify Everything Works

### ✅ Backend Checklist:
- [ ] PostgreSQL service running
- [ ] Redis/Memurai service running
- [ ] Database `voting_db` created
- [ ] Backend server started (npm run dev)
- [ ] No errors in console
- [ ] http://localhost:5000/api/health responds

### ✅ Frontend Checklist:
- [ ] Frontend server started (npm run dev)
- [ ] http://localhost:5173 loads
- [ ] Can see login page
- [ ] Can login with test credentials
- [ ] Dashboard loads

---

## 🎯 Alternative: Use Docker Desktop

If you want to use Docker (recommended for easier setup):

1. **Download Docker Desktop:**
   - https://www.docker.com/products/docker-desktop/
   - Install it
   - Restart computer

2. **Start Docker Desktop**

3. **Run original setup:**
   ```powershell
   docker-compose up -d
   ```

This automatically installs and configures PostgreSQL and Redis.

---

## 💡 Database Management Tools

### pgAdmin 4 (Installed with PostgreSQL):
- Open pgAdmin 4
- Connect to localhost
- Browse your `voting_db` database
- View tables, run queries

### Prisma Studio (Built-in):
```powershell
cd backend
npx prisma studio
```
- Opens at http://localhost:5555
- Visual database editor
- View/edit all data

---

## 📝 Quick Commands Reference

### PostgreSQL:
```powershell
# Start service
Start-Service postgresql-x64-15

# Stop service
Stop-Service postgresql-x64-15

# Connect to database
psql -U postgres -d voting_db
```

### Redis/Memurai:
```powershell
# Start service
Start-Service Memurai

# Stop service
Stop-Service Memurai
```

### Backend:
```powershell
cd backend
npm run dev              # Start server
npm run prisma:studio    # Open database GUI
npm run prisma:migrate   # Run migrations
npm run prisma:seed      # Seed data
```

### Frontend:
```powershell
cd frontend
npm run dev              # Start server
npm run build            # Build for production
```

---

## 🎉 Success!

Once both servers are running:
- **Backend:** http://localhost:5000
- **Frontend:** http://localhost:5173
- **Prisma Studio:** npx prisma studio (http://localhost:5555)
- **pgAdmin:** Launch from Start Menu

---

## 🚀 Next Steps

1. ✅ Login with test credentials
2. ✅ Explore the dashboard
3. ✅ Create a new election
4. ✅ Cast votes
5. ✅ View results
6. 📝 Customize as needed

---

## 📚 Need More Help?

- **PostgreSQL Setup:** https://www.postgresql.org/docs/15/tutorial-install.html
- **Memurai Docs:** https://docs.memurai.com/
- **Project README:** README.md
- **Installation Guide:** INSTALLATION.md

---

**Happy Voting! 🗳️**
