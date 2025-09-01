const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Full name cannot exceed 100 characters']
  },
  membershipId: {
    type: String,
    required: [true, 'Membership ID is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long']
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    match: [/^[0-9]{10,15}$/, 'Please enter a valid mobile number']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true }
  },
  nic: {
    type: String,
    required: [true, 'NIC is required'],
    unique: true,
    uppercase: true
  },
  division: {
    type: String,
    required: [true, 'Division is required'],
    enum: ['IT', 'Finance', 'HR', 'Operations', 'Marketing', 'Sales', 'Engineering', 'Support']
  },
  role: {
    type: String,
    enum: ['voter', 'executive', 'admin'],
    default: 'voter'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  otp: {
    code: String,
    expiresAt: Date
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate OTP
userSchema.methods.generateOTP = function() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.otp = {
    code: otp,
    expiresAt: new Date(Date.now() + 3 * 60 * 1000) // 3 minutes
  };
  return otp;
};

// Method to verify OTP
userSchema.methods.verifyOTP = function(otpCode) {
  if (!this.otp || !this.otp.code || !this.otp.expiresAt) {
    return false;
  }
  
  if (Date.now() > this.otp.expiresAt) {
    this.otp = undefined;
    return false;
  }
  
  if (this.otp.code !== otpCode) {
    return false;
  }
  
  this.otp = undefined;
  return true;
};

module.exports = mongoose.model('User', userSchema);
