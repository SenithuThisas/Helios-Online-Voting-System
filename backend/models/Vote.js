const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  voter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  election: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Election',
    required: true
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Compound unique index to ensure one vote per user per election
voteSchema.index({ voter: 1, election: 1 }, { unique: true });

// Index for efficient queries
voteSchema.index({ election: 1, candidate: 1 });
voteSchema.index({ timestamp: 1 });

// Pre-save middleware to update vote counts
voteSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      // Update candidate vote count
      const Candidate = mongoose.model('Candidate');
      await Candidate.findByIdAndUpdate(
        this.candidate,
        { $inc: { voteCount: 1 } }
      );

      // Update election total votes
      const Election = mongoose.model('Election');
      await Election.findByIdAndUpdate(
        this.election,
        { $inc: { totalVotes: 1 } }
      );
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Method to verify vote integrity
voteSchema.methods.verifyIntegrity = function() {
  // Basic integrity checks
  if (!this.voter || !this.election || !this.candidate) {
    return false;
  }
  
  if (!this.timestamp || !this.ipAddress) {
    return false;
  }
  
  return true;
};

module.exports = mongoose.model('Vote', voteSchema);
