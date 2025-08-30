const mongoose = require('mongoose');

const electionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Election title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Election description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  status: {
    type: String,
    enum: ['upcoming', 'active', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  division: {
    type: String,
    required: [true, 'Division is required'],
    enum: ['IT', 'Finance', 'HR', 'Operations', 'Marketing', 'Sales', 'Engineering', 'Support', 'All']
  },
  maxCandidates: {
    type: Number,
    required: [true, 'Maximum number of candidates is required'],
    min: [2, 'Minimum 2 candidates required'],
    max: [20, 'Maximum 20 candidates allowed']
  },
  totalVotes: {
    type: Number,
    default: 0
  },
  isSecretBallot: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
electionSchema.index({ status: 1, startDate: 1, endDate: 1 });
electionSchema.index({ division: 1, status: 1 });

// Virtual for checking if election is active
electionSchema.virtual('isActive').get(function() {
  const now = new Date();
  return this.status === 'active' && now >= this.startDate && now <= this.endDate;
});

// Method to check if user can vote
electionSchema.methods.canUserVote = function(userDivision) {
  if (this.status !== 'active') return false;
  
  const now = new Date();
  if (now < this.startDate || now > this.endDate) return false;
  
  if (this.division !== 'All' && this.division !== userDivision) return false;
  
  return true;
};

// Method to update status based on dates
electionSchema.methods.updateStatus = function() {
  const now = new Date();
  
  if (now < this.startDate) {
    this.status = 'upcoming';
  } else if (now >= this.startDate && now <= this.endDate) {
    this.status = 'active';
  } else {
    this.status = 'completed';
  }
  
  return this.status;
};

module.exports = mongoose.model('Election', electionSchema);
