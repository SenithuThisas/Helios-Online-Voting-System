const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testLoginFlow() {
  try {
    console.log('🧪 Testing Login Flow...\n');

    // Test 1: Invalid login credentials
    console.log('1. Testing invalid credentials...');
    try {
      await axios.post(`${API_BASE_URL}/auth/login`, {
        email: 'invalid@example.com',
        nic: 'INVALID123',
        password: 'wrongpassword'
      });
    } catch (error) {
      console.log('✅ Invalid credentials rejected:', error.response.data.message);
    }

    // Test 2: Valid login credentials (if user exists)
    console.log('\n2. Testing valid login...');
    try {
      const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: 'admin@helios.com',
        nic: 'ADMIN123',
        password: 'AdminPass123'
      });
      
      console.log('✅ Login successful:', loginResponse.data.message);
      console.log('   User ID:', loginResponse.data.userId);
      console.log('   OTP (dev only):', loginResponse.data.otp);
      
      // Test 3: OTP verification
      console.log('\n3. Testing OTP verification...');
      const otpResponse = await axios.post(`${API_BASE_URL}/auth/verify-otp`, {
        userId: loginResponse.data.userId,
        otp: loginResponse.data.otp
      });
      
      console.log('✅ OTP verification successful:', otpResponse.data.message);
      console.log('   Token received:', otpResponse.data.token ? 'Yes' : 'No');
      console.log('   User role:', otpResponse.data.user.role);
      
    } catch (error) {
      console.log('❌ Login failed:', error.response?.data?.message || error.message);
    }

    console.log('\n🎉 Login flow test completed!');
    console.log('\n📋 Next steps:');
    console.log('   1. Start frontend: cd frontend && npm start');
    console.log('   2. Open http://localhost:3000/login');
    console.log('   3. Use valid credentials to test the UI');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testLoginFlow();
