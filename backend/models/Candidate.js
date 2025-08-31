const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Candidate full name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  membershipId: {
    type: String,
    required: [true, 'Membership ID is required'],
    trim: true,
    uppercase: true
  },
  division: {
    type: String,
    required: [true, 'Division is required'],
    enum: ['IT', 'Finance', 'HR', 'Operations', 'Marketing', 'Sales', 'Engineering', 'Support']
  },
  position: {
    type: String,
    required: [true, 'Position is required'],
    trim: true,
    maxlength: [100, 'Position cannot exceed 100 characters']
  },
  manifesto: {
    type: String,
    required: [true, 'Manifesto is required'],
    trim: true,
    maxlength: [2000, 'Manifesto cannot exceed 2000 characters']
  },
  experience: {
    type: String,
    required: [true, 'Experience details are required'],
    trim: true,
    maxlength: [500, 'Experience cannot exceed 500 characters']
  },
  election: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Election',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  voteCount: {
    type: Number,
    default: 0
  },
  photo: {
    type: String, // URL to photo
    default: null
  }
}, {
  timestamps: true
});

// Index for efficient queries
candidateSchema.index({ election: 1, division: 1 });
candidateSchema.index({ isActive: 1 });

// Virtual for vote percentage
candidateSchema.virtual('votePercentage').get(function() {
  if (!this.election || this.election.totalVotes === 0) return 0;
  return ((this.voteCount / this.election.totalVotes) * 100).toFixed(2);
});

module.exports = mongoose.model('Candidate', candidateSchema);
