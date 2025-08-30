const express = require('express');
const router = express.Router();
const Election = require('../models/Election');
const Candidate = require('../models/Candidate');
const Vote = require('../models/Vote');
const { validateVote } = require('../middleware/validation');
const { authenticateToken, requireVoter, canVoteInElection } = require('../middleware/auth');

// @route   GET /api/vote/elections
// @desc    Get all elections for the user's division
// @access  Private
router.get('/elections', authenticateToken, requireVoter, async (req, res) => {
  try {
    const elections = await Election.find({
      $or: [
        { division: req.user.division },
        { division: 'All' }
      ]
    }).sort({ startDate: -1 });

    // Update election statuses
    const updatedElections = elections.map(election => {
      election.updateStatus();
      return election;
    });

    res.json({ elections: updatedElections });
  } catch (error) {
    console.error('Get elections error:', error);
    res.status(500).json({ message: 'Server error while fetching elections' });
  }
});

// @route   GET /api/vote/elections/:id
// @desc    Get specific election details
// @access  Private
router.get('/elections/:id', authenticateToken, requireVoter, async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    // Check if user can vote in this election
    if (!election.canUserVote(req.user.division)) {
      return res.status(400).json({ message: 'You are not eligible to vote in this election' });
    }

    // Check if user has already voted
    const existingVote = await Vote.findOne({
      voter: req.user._id,
      election: election._id
    });

    election.updateStatus();
    
    res.json({ 
      election,
      hasVoted: !!existingVote,
      canVote: election.status === 'active' && !existingVote
    });
  } catch (error) {
    console.error('Get election error:', error);
    res.status(500).json({ message: 'Server error while fetching election' });
  }
});

// @route   GET /api/vote/elections/:id/candidates
// @desc    Get candidates for a specific election
// @access  Private
router.get('/elections/:id/candidates', authenticateToken, requireVoter, async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    const candidates = await Candidate.find({
      election: req.params.id,
      isActive: true
    }).select('-__v');

    res.json({ candidates });
  } catch (error) {
    console.error('Get candidates error:', error);
    res.status(500).json({ message: 'Server error while fetching candidates' });
  }
});

// @route   POST /api/vote/elections/:id/vote
// @desc    Submit a vote for a candidate
// @access  Private
router.post('/elections/:id/vote', authenticateToken, requireVoter, canVoteInElection, validateVote, async (req, res) => {
  try {
    const { candidateId } = req.body;
    const { electionId } = req.params;

    // Verify candidate exists and belongs to this election
    const candidate = await Candidate.findOne({
      _id: candidateId,
      election: electionId,
      isActive: true
    });

    if (!candidate) {
      return res.status(400).json({ message: 'Invalid candidate' });
    }

    // Create vote record
    const vote = new Vote({
      voter: req.user._id,
      election: electionId,
      candidate: candidateId,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    });

    await vote.save();

    res.json({
      message: 'Vote submitted successfully',
      voteId: vote._id,
      timestamp: vote.timestamp
    });

  } catch (error) {
    if (error.code === 11000) { // Duplicate key error
      return res.status(400).json({ message: 'You have already voted in this election' });
    }
    
    console.error('Submit vote error:', error);
    res.status(500).json({ message: 'Server error while submitting vote' });
  }
});

// @route   GET /api/vote/my-votes
// @desc    Get user's voting history
// @access  Private
router.get('/my-votes', authenticateToken, requireVoter, async (req, res) => {
  try {
    const votes = await Vote.find({ voter: req.user._id })
      .populate('election', 'title startDate endDate status')
      .populate('candidate', 'fullName position')
      .sort({ timestamp: -1 });

    res.json({ votes });
  } catch (error) {
    console.error('Get voting history error:', error);
    res.status(500).json({ message: 'Server error while fetching voting history' });
  }
});

// @route   GET /api/vote/elections/:id/results
// @desc    Get election results (only for completed elections)
// @access  Private
router.get('/elections/:id/results', authenticateToken, requireVoter, async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    // Only show results for completed elections
    if (election.status !== 'completed') {
      return res.status(400).json({ message: 'Election results are not available yet' });
    }

    const candidates = await Candidate.find({
      election: req.params.id,
      isActive: true
    }).select('fullName position voteCount').sort({ voteCount: -1 });

    const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.voteCount, 0);

    // Calculate percentages
    const results = candidates.map(candidate => ({
      ...candidate.toObject(),
      percentage: totalVotes > 0 ? ((candidate.voteCount / totalVotes) * 100).toFixed(2) : '0.00'
    }));

    res.json({
      election: {
        title: election.title,
        totalVotes,
        status: election.status
      },
      results
    });

  } catch (error) {
    console.error('Get election results error:', error);
    res.status(500).json({ message: 'Server error while fetching election results' });
  }
});

module.exports = router;
