# 🎯 START HERE - Windows Quick Guide

## Welcome to Helios Online Voting System! 🗳️

Follow these simple steps to get started on Windows.

---

## ⚡ Super Quick Setup (Recommended)

### Option 1: Install Docker Desktop (Easiest)

1. **Download Docker Desktop:**
   - Visit: https://www.docker.com/products/docker-desktop/
   - Click "Download for Windows"
   - Run installer
   - Restart computer

2. **Start Docker Desktop:**
   - Launch Docker Desktop from Start Menu
   - Wait for it to start (green icon)

3. **Run the app:**
   ```powershell
   # In PowerShell in project folder
   docker-compose up -d
   cd backend
   npm install
   npm run prisma:generate
   npm run prisma:migrate
   npm run prisma:seed
   npm run dev
   ```

4. **In another PowerShell window:**
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

5. **Open browser:** http://localhost:5173

---

## 🔧 Option 2: Install PostgreSQL & Redis Manually

If you don't want Docker:

### Step 1: Install PostgreSQL
- Download: https://www.postgresql.org/download/windows/
- Install with default settings
- Remember password you set!

### Step 2: Install Memurai (Redis for Windows)
- Download: https://www.memurai.com/get-memurai
- Install with default settings

### Step 3: Setup Backend
```powershell
cd backend

# Create .env file
copy .env.example .env

# Edit .env if you used different PostgreSQL password
notepad .env

# Install and setup
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

### Step 4: Setup Frontend (New PowerShell)
```powershell
cd frontend
npm install
npm run dev
```

### Step 5: Open App
http://localhost:5173

**See SETUP_WITHOUT_DOCKER.md for detailed instructions**

---

## 🧪 Test Login

After setup, login with:

**Chairman Account:**
- NIC: `199012345678`
- Password: `password123`

**Voter Account:**
- NIC: `199300000001`
- Password: `password123`

---

## 📁 What's in This Project?

```
Helios-Online-Voting-System/
│
├── 📖 START_HERE_WINDOWS.md  ← You are here!
├── 📖 SETUP_WITHOUT_DOCKER.md ← Detailed Windows setup
├── 📖 README.md               ← Full documentation
├── 📖 INSTALLATION.md         ← Step-by-step install guide
│
├── 🔧 backend/                ← Node.js TypeScript API
├── 🎨 frontend/               ← React TypeScript App
└── 🐳 docker-compose.yml      ← Docker configuration
```

---

## 🆘 Common Issues

### "docker: command not found"
→ Install Docker Desktop (Option 1 above)
→ OR follow Option 2 (manual install)

### "Port 5000 already in use"
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

### "Cannot connect to database"
→ Make sure PostgreSQL is installed and running
→ Check password in backend/.env matches PostgreSQL password

### "Redis connection error"
→ Install Memurai from https://www.memurai.com/get-memurai
→ Start Memurai service

---

## 📚 Documentation Files

Choose your guide:

1. **QUICK START** → This file (you're here!)
2. **NO DOCKER** → SETUP_WITHOUT_DOCKER.md
3. **DETAILED INSTALL** → INSTALLATION.md
4. **FULL DOCS** → README.md
5. **WHAT'S BUILT** → PROJECT_SUMMARY.md

---

## ✅ Prerequisites

You need:
- ✅ Node.js 20+ (https://nodejs.org/)
- ✅ PostgreSQL 15+ (https://www.postgresql.org/download/windows/)
- ✅ Redis/Memurai (https://www.memurai.com/get-memurai)
- 🐳 Docker (optional, recommended)

Check if Node.js is installed:
```powershell
node --version
# Should show: v20.x.x or higher
```

---

## 🎯 After Setup

### What You Can Do:

✅ **Chairman Dashboard:**
- Create elections
- Add candidates
- Manage users
- Assign roles
- Publish results

✅ **Voter Dashboard:**
- View elections
- Cast votes
- See results

✅ **Real-time Updates:**
- Live vote counting
- Election notifications
- Result updates

---

## 🚀 Production Deployment

When ready to deploy:
1. Read README.md deployment section
2. Build backend: `npm run build`
3. Build frontend: `npm run build`
4. Deploy to cloud (AWS, Azure, etc.)

---

## 💡 Tips

- Use **Prisma Studio** to view database: `npx prisma studio`
- Use **pgAdmin** to manage PostgreSQL
- Check browser console (F12) for errors
- Check backend terminal for errors
- Both servers must be running

---

## 🆘 Need Help?

1. Check **SETUP_WITHOUT_DOCKER.md** for detailed troubleshooting
2. Check **INSTALLATION.md** for step-by-step guide
3. Review error messages in console
4. Make sure all services are running

---

## ⏭️ Next Steps

1. ✅ Install prerequisites (Node.js, PostgreSQL, Redis)
2. ✅ Follow setup steps above
3. ✅ Login with test credentials
4. ✅ Create your first election
5. ✅ Cast votes and see results!

---

**Choose your path:**
- **Have Docker?** → Use docker-compose (easier)
- **No Docker?** → Follow SETUP_WITHOUT_DOCKER.md
- **Need details?** → Read INSTALLATION.md

---

**🎉 Ready to start? Pick an option above and let's go! 🗳️**
