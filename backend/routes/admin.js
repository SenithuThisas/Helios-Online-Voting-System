const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Election = require('../models/Election');
const Candidate = require('../models/Candidate');
const Vote = require('../models/Vote');
const { validateElection, validateCandidate } = require('../middleware/validation');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private (Admin only)
router.get('/dashboard', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Get counts
    const totalUsers = await User.countDocuments();
    const totalElections = await Election.countDocuments();
    const totalCandidates = await Candidate.countDocuments();
    const totalVotes = await Vote.countDocuments();

    // Get recent elections
    const recentElections = await Election.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title status startDate endDate totalVotes');

    // Get active elections
    const activeElections = await Election.find({ status: 'active' })
      .select('title division totalVotes');

    // Get user statistics by division
    const usersByDivision = await User.aggregate([
      { $group: { _id: '$division', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      statistics: {
        totalUsers,
        totalElections,
        totalCandidates,
        totalVotes
      },
      recentElections,
      activeElections,
      usersByDivision
    });

  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: 'Server error while fetching dashboard data' });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with pagination
// @access  Private (Admin only)
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const division = req.query.division || '';

    const query = {};
    
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { membershipId: { $regex: search, $options: 'i' } }
      ];
    }

    if (division) {
      query.division = division;
    }

    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .select('-password -otp')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
});

// @route   PUT /api/admin/users/:id/status
// @desc    Update user status (activate/deactivate)
// @access  Private (Admin only)
router.put('/users/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { isActive } = req.body;
    const userId = req.params.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true }
    ).select('-password -otp');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user
    });

  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Server error while updating user status' });
  }
});

// @route   POST /api/admin/elections
// @desc    Create a new election
// @access  Private (Admin only)
router.post('/elections', authenticateToken, requireAdmin, validateElection, async (req, res) => {
  try {
    const electionData = {
      ...req.body,
      createdBy: req.user._id
    };

    const election = new Election(electionData);
    await election.save();

    res.status(201).json({
      message: 'Election created successfully',
      election
    });

  } catch (error) {
    console.error('Create election error:', error);
    res.status(500).json({ message: 'Server error while creating election' });
  }
});

// @route   PUT /api/admin/elections/:id
// @desc    Update an election
// @access  Private (Admin only)
router.put('/elections/:id', authenticateToken, requireAdmin, validateElection, async (req, res) => {
  try {
    const election = await Election.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    res.json({
      message: 'Election updated successfully',
      election
    });

  } catch (error) {
    console.error('Update election error:', error);
    res.status(500).json({ message: 'Server error while updating election' });
  }
});

// @route   DELETE /api/admin/elections/:id
// @desc    Delete an election (only if no votes cast)
// @access  Private (Admin only)
router.delete('/elections/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    // Check if any votes have been cast
    const voteCount = await Vote.countDocuments({ election: req.params.id });
    if (voteCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete election with existing votes' 
      });
    }

    // Delete candidates first
    await Candidate.deleteMany({ election: req.params.id });
    
    // Delete election
    await Election.findByIdAndDelete(req.params.id);

    res.json({ message: 'Election deleted successfully' });

  } catch (error) {
    console.error('Delete election error:', error);
    res.status(500).json({ message: 'Server error while deleting election' });
  }
});

// @route   POST /api/admin/candidates
// @desc    Create a new candidate
// @access  Private (Admin only)
router.post('/candidates', authenticateToken, requireAdmin, validateCandidate, async (req, res) => {
  try {
    const candidate = new Candidate(req.body);
    await candidate.save();

    res.status(201).json({
      message: 'Candidate created successfully',
      candidate
    });

  } catch (error) {
    console.error('Create candidate error:', error);
    res.status(500).json({ message: 'Server error while creating candidate' });
  }
});

// @route   PUT /api/admin/candidates/:id
// @desc    Update a candidate
// @access  Private (Admin only)
router.put('/candidates/:id', authenticateToken, requireAdmin, validateCandidate, async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    res.json({
      message: 'Candidate updated successfully',
      candidate
    });

  } catch (error) {
    console.error('Update candidate error:', error);
    res.status(500).json({ message: 'Server error while updating candidate' });
  }
});

// @route   DELETE /api/admin/candidates/:id
// @desc    Delete a candidate (only if no votes cast)
// @access  Private (Admin only)
router.delete('/candidates/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    // Check if any votes have been cast for this candidate
    const voteCount = await Vote.countDocuments({ candidate: req.params.id });
    if (voteCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete candidate with existing votes' 
      });
    }

    await Candidate.findByIdAndDelete(req.params.id);

    res.json({ message: 'Candidate deleted successfully' });

  } catch (error) {
    console.error('Delete candidate error:', error);
    res.status(500).json({ message: 'Server error while deleting candidate' });
  }
});

// @route   GET /api/admin/elections/:id/results
// @desc    Get detailed election results (admin view)
// @access  Private (Admin only)
router.get('/elections/:id/results', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    const candidates = await Candidate.find({
      election: req.params.id,
      isActive: true
    }).sort({ voteCount: -1 });

    const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.voteCount, 0);

    // Get voter details for audit trail
    const votes = await Vote.find({ election: req.params.id })
      .populate('voter', 'fullName membershipId division')
      .populate('candidate', 'fullName position')
      .sort({ timestamp: -1 });

    const results = candidates.map(candidate => ({
      ...candidate.toObject(),
      percentage: totalVotes > 0 ? ((candidate.voteCount / totalVotes) * 100).toFixed(2) : '0.00'
    }));

    res.json({
      election: {
        title: election.title,
        totalVotes,
        status: election.status,
        startDate: election.startDate,
        endDate: election.endDate
      },
      results,
      votes: votes.map(vote => ({
        id: vote._id,
        voter: vote.voter,
        candidate: vote.candidate,
        timestamp: vote.timestamp,
        ipAddress: vote.ipAddress
      }))
    });

  } catch (error) {
    console.error('Get admin election results error:', error);
    res.status(500).json({ message: 'Server error while fetching election results' });
  }
});

module.exports = router;
