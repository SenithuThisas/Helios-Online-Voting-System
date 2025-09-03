const mongoose = require('mongoose');
const User = require('./models/User');
const { generateToken } = require('./utils/jwt');
require('dotenv').config();

// Test admin login process
async function testAdminLogin() {
  try {
    console.log('🔐 Testing Admin Login Process...\n');

    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/helios_voting_system';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Admin credentials
    const adminEmail = 'admin@helios.com';
    const adminNIC = 'ADMIN123456789';
    const adminPassword = 'AdminPass123!';

    // Step 1: Find admin user
    console.log('\n📋 Step 1: Finding admin user...');
    const admin = await User.findOne({ email: adminEmail, nic: adminNIC });
    
    if (!admin) {
      console.log('❌ Admin user not found. Please create admin account first.');
      console.log('   Use: POST http://localhost:5000/api/auth/register with role: "admin"');
      return;
    }
    
    console.log('✅ Admin user found:');
    console.log(`   Name: ${admin.fullName}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   Division: ${admin.division}`);

    // Step 2: Test password verification
    console.log('\n🔑 Step 2: Testing password verification...');
    const isPasswordValid = await admin.comparePassword(adminPassword);
    console.log(`✅ Password verification: ${isPasswordValid ? 'SUCCESS' : 'FAILED'}`);

    if (!isPasswordValid) {
      console.log('❌ Invalid password. Please check admin credentials.');
      return;
    }

    // Step 3: Generate OTP (simulating login)
    console.log('\n📱 Step 3: Generating OTP...');
    const otp = admin.generateOTP();
    await admin.save();
    console.log(`✅ OTP generated: ${otp}`);
    console.log(`   Expires in: 3 minutes`);

    // Step 4: Verify OTP (simulating OTP verification)
    console.log('\n✅ Step 4: Verifying OTP...');
    const isOTPValid = admin.verifyOTP(otp);
    console.log(`✅ OTP verification: ${isOTPValid ? 'SUCCESS' : 'FAILED'}`);

    if (!isOTPValid) {
      console.log('❌ OTP verification failed.');
      return;
    }

    // Step 5: Generate JWT token
    console.log('\n🎫 Step 5: Generating JWT token...');
    const token = generateToken(admin._id);
    console.log('✅ JWT token generated successfully');
    console.log(`Token: ${token.substring(0, 50)}...`);

    // Step 6: Test token verification
    console.log('\n🔍 Step 6: Testing JWT token verification...');
    const { verifyToken } = require('./utils/jwt');
    const decoded = verifyToken(token);
    console.log('✅ JWT token verified successfully');
    console.log(`   User ID: ${decoded.userId}`);
    console.log(`   Expires: ${new Date(decoded.exp * 1000).toLocaleString()}`);

    console.log('\n🎉 Admin login process completed successfully!');
    console.log('\n📋 Admin Login Summary:');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   NIC: ${adminNIC}`);
    console.log(`   Password: ${adminPassword}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   JWT Token: ${token.substring(0, 50)}...`);

    console.log('\n🌐 API Endpoints to use:');
    console.log('   1. Login: POST http://localhost:5000/api/auth/login');
    console.log('   2. Verify OTP: POST http://localhost:5000/api/auth/verify-otp');
    console.log('   3. Get Profile: GET http://localhost:5000/api/auth/me');
    console.log('   4. Admin Routes: Use JWT token in Authorization header');

  } catch (error) {
    console.error('❌ Admin login test failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the test
testAdminLogin();
