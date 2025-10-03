# ✅ Installation Checklist

Follow this checklist to get Helios Voting System running on Windows.

---

## 📋 Pre-Installation

### Check Prerequisites:

```powershell
# Run these commands in PowerShell:
node --version    # Should be v20 or higher
npm --version     # Should show version number
```

- [ ] Node.js v20+ installed
- [ ] npm installed (comes with Node.js)

If not installed:
- Download Node.js from: https://nodejs.org/

---

## 🗄️ Database Setup

### Choose ONE option:

### ☐ Option A: Docker (Recommended - Easiest)

- [ ] Download Docker Desktop: https://www.docker.com/products/docker-desktop/
- [ ] Install Docker Desktop
- [ ] Restart computer
- [ ] Start Docker Desktop
- [ ] Wait for Docker to be running (green icon)
- [ ] Run: `docker-compose up -d`
- [ ] Verify: `docker ps` shows 3 containers

**✅ Skip to Backend Setup if using Docker**

---

### ☐ Option B: Manual Installation (No Docker)

#### PostgreSQL:
- [ ] Download from: https://www.postgresql.org/download/windows/
- [ ] Run installer (PostgreSQL 15+)
- [ ] Set password: `voting_password` (or remember your password)
- [ ] Port: `5432` (default)
- [ ] Install pgAdmin 4 (checkbox)
- [ ] Finish installation
- [ ] Verify service is running: `Get-Service postgresql*`

#### Redis:
- [ ] Download Memurai: https://www.memurai.com/get-memurai
- [ ] Run installer
- [ ] Finish installation
- [ ] Verify service is running: `Get-Service Memurai*`

#### Create Database:
- [ ] Open pgAdmin 4
- [ ] Connect to PostgreSQL server
- [ ] Right-click "Databases" → Create → Database
- [ ] Name: `voting_db`
- [ ] Click Save

---

## 🔧 Backend Setup

```powershell
cd backend
```

### Installation:
- [ ] Run: `npm install`
- [ ] Wait for installation to complete (may take 2-5 minutes)

### Configuration:
- [ ] Run: `copy .env.example .env`
- [ ] **If using manual PostgreSQL:** Edit `.env` file
  - [ ] Open: `notepad .env`
  - [ ] Update `DATABASE_URL` with your PostgreSQL password
  - [ ] Save and close

### Database Setup:
- [ ] Run: `npm run prisma:generate`
- [ ] Run: `npm run prisma:migrate`
- [ ] Run: `npm run prisma:seed`
- [ ] All should complete without errors

### Start Backend:
- [ ] Run: `npm run dev`
- [ ] Wait for success messages:
  ```
  ✅ Database connected successfully
  ✅ Redis connected successfully
  ✅ Socket.io initialized successfully
  Server running on http://localhost:5000
  ```

### Test Backend:
- [ ] Open browser: http://localhost:5000/api/health
- [ ] Should see: `{"success":true,"message":"API is running",...}`

**✅ Keep this terminal open and running**

---

## 🎨 Frontend Setup

**Open a NEW PowerShell window:**

```powershell
cd frontend
```

### Installation:
- [ ] Run: `npm install`
- [ ] Wait for installation (may take 2-5 minutes)

### Configuration:
- [ ] Run: `copy .env.example .env`
- [ ] (No need to edit for local development)

### Start Frontend:
- [ ] Run: `npm run dev`
- [ ] Wait for:
  ```
  VITE ready in XXX ms
  Local: http://localhost:5173/
  ```

### Test Frontend:
- [ ] Open browser: http://localhost:5173
- [ ] Should see login page with "Helios Voting System"

**✅ Keep this terminal open and running**

---

## 🧪 Test the Application

### Login Test:

- [ ] Go to: http://localhost:5173
- [ ] Enter NIC: `199012345678`
- [ ] Enter Password: `password123`
- [ ] Click "Login"
- [ ] Should see dashboard with statistics

### Feature Tests:

- [ ] Navigate to "Elections" (sidebar or bottom nav)
- [ ] Should see sample elections
- [ ] Click on an election to view details
- [ ] Navigate to "Users" (if Chairman)
- [ ] Should see list of users

### Logout and Re-login as Voter:

- [ ] Click logout
- [ ] Login with:
  - [ ] NIC: `199300000001`
  - [ ] Password: `password123`
- [ ] Should see voter dashboard
- [ ] View available elections

---

## ✅ Final Verification

### Both terminals should be running:
- [ ] **Terminal 1:** Backend server (port 5000)
- [ ] **Terminal 2:** Frontend server (port 5173)

### URLs should work:
- [ ] Backend API: http://localhost:5000/api/health
- [ ] Frontend App: http://localhost:5173
- [ ] Can login successfully
- [ ] Can navigate pages without errors

### No errors in:
- [ ] Backend terminal
- [ ] Frontend terminal
- [ ] Browser console (F12 → Console tab)

---

## 🎉 Success Checklist

If all above are checked:

✅ **PostgreSQL** - Running
✅ **Redis** - Running
✅ **Backend** - Running on port 5000
✅ **Frontend** - Running on port 5173
✅ **Database** - Migrated and seeded
✅ **Login** - Works with test credentials
✅ **Navigation** - All pages load

---

## 🆘 Troubleshooting

### Backend won't start:

**Check PostgreSQL:**
```powershell
# If using Docker
docker ps | findstr postgres

# If using manual install
Get-Service postgresql*
```

**Check Redis:**
```powershell
# If using Docker
docker ps | findstr redis

# If using manual install
Get-Service Memurai*
```

**Fix database issues:**
```powershell
cd backend
npx prisma migrate reset  # WARNING: Deletes data!
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

### Frontend won't start:

**Clear cache and reinstall:**
```powershell
cd frontend
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
npm run dev
```

### Port already in use:

**Backend (port 5000):**
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Frontend (port 5173):**
```powershell
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Cannot login:

- [ ] Make sure backend is running
- [ ] Check backend terminal for errors
- [ ] Check browser console (F12) for errors
- [ ] Verify database was seeded: `npx prisma studio`
- [ ] Look for users table with test data

---

## 📚 Next Steps After Success

1. **Explore the code:**
   - Backend: `backend/src/`
   - Frontend: `frontend/src/`

2. **Read documentation:**
   - README.md - Full documentation
   - SETUP_WITHOUT_DOCKER.md - Windows setup details
   - PROJECT_SUMMARY.md - What's included

3. **Customize:**
   - Change colors in `frontend/tailwind.config.ts`
   - Modify branding
   - Add features

4. **Deploy:**
   - Build for production
   - Deploy to cloud

---

## 🎓 Test Accounts

**Chairman (Full Access):**
- NIC: `199012345678`
- Password: `password123`

**Secretary:**
- NIC: `199123456789`
- Password: `password123`

**Voters:**
- NIC: `199300000001` to `199300000010`
- Password: `password123` (all)

---

## 📞 Need More Help?

1. **Windows Setup:** Read SETUP_WITHOUT_DOCKER.md
2. **Detailed Install:** Read INSTALLATION.md
3. **Full Docs:** Read README.md
4. **Quick Start:** Read START_HERE_WINDOWS.md

---

**Print this checklist and check off each item as you complete it! ✅**

**Good luck! 🗳️**
