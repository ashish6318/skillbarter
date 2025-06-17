const User = require('../models/User');
const { paginateWithCursor } = require('../utils/pagination');
const { formatError, formatSuccess, isValidObjectId } = require('../utils/helpers');

// Get paginated list of users with skills (Discover page)
const getDiscoverUsers = async (req, res) => {
  try {
    const {
      cursor,
      limit = 12,
      skill,
      category,
      language,
      minRating,
      country,
      sortBy = 'lastSeen'
    } = req.query;
    
    // Build filter query
    let query = { 
      _id: { $ne: req.user?.id }, // Exclude current user if authenticated
      isActive: true,
      isBanned: false,
      'skillsOffered.0': { $exists: true } // Has at least one skill offered
    };
    
    // Apply filters
    if (skill) {
      query['skillsOffered.skill'] = new RegExp(skill, 'i');
    }
    
    if (category) {
      query['skillsOffered.category'] = category;
    }
    
    if (language) {
      query.languages = { $in: [language] };
    }
    
    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }
    
    if (country) {
      query.country = new RegExp(country, 'i');
    }
    
    // Determine sort field
    const sortField = sortBy === 'rating' ? 'rating' : 'lastSeen';
    const sortOrder = sortBy === 'rating' ? -1 : -1; // Both descending
    
    const result = await paginateWithCursor(User, query, {
      cursor: cursor ? new Date(cursor) : null,
      limit: parseInt(limit),
      sortField,
      sortOrder,
      populate: 'skillsOffered skillsWanted'
    });
    
    // Transform data to public profiles
    const publicProfiles = result.data.map(user => ({
      _id: user._id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      profilePicture: user.profilePicture,
      bio: user.bio,
      country: user.country,
      languages: user.languages,
      skillsOffered: user.skillsOffered,
      skillsWanted: user.skillsWanted,
      rating: user.rating,
      totalReviews: user.totalReviews,
      totalHoursTaught: user.totalHoursTaught,
      lastSeen: user.lastSeen,
      isOnline: Date.now() - new Date(user.lastSeen).getTime() < 5 * 60 * 1000 // Online if seen within 5 minutes
    }));
    
    res.json(formatSuccess(publicProfiles, 'Users retrieved successfully', result.pagination));
    
  } catch (error) {
    console.error('Discover users error:', error);
    res.status(500).json(formatError('Server error fetching users'));
  }
};

// Search users by skill or other criteria
const searchUsers = async (req, res) => {
  try {
    const { q, category, limit = 20 } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json(formatError('Search query must be at least 2 characters', 400));
    }
    
    const searchRegex = new RegExp(q.trim(), 'i');
    
    let query = {
      isActive: true,
      isBanned: false,
      $or: [
        { 'skillsOffered.skill': searchRegex },
        { firstName: searchRegex },
        { lastName: searchRegex },
        { username: searchRegex }
      ]
    };
    
    if (req.user?.id) {
      query._id = { $ne: req.user.id };
    }
    
    if (category) {
      query['skillsOffered.category'] = category;
    }
    
    const users = await User.find(query)
      .select('username firstName lastName profilePicture bio skillsOffered rating totalReviews lastSeen')
      .limit(parseInt(limit))
      .sort({ rating: -1, lastSeen: -1 });
    
    const results = users.map(user => ({
      _id: user._id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      profilePicture: user.profilePicture,
      bio: user.bio,
      skillsOffered: user.skillsOffered,
      rating: user.rating,
      totalReviews: user.totalReviews,
      isOnline: Date.now() - new Date(user.lastSeen).getTime() < 5 * 60 * 1000
    }));
    
    res.json(formatSuccess(results, `Found ${results.length} users`));
    
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json(formatError('Server error searching users'));
  }
};

// Get all skill categories
const getCategories = async (req, res) => {
  try {
    const categories = [
      'Technology',
      'Design', 
      'Business',
      'Language',
      'Music',
      'Sports',
      'Cooking',
      'Other'
    ];
    
    // Get category counts
    const categoryCounts = await User.aggregate([
      { $match: { isActive: true, isBanned: false } },
      { $unwind: '$skillsOffered' },
      { $group: { _id: '$skillsOffered.category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const categoriesWithCounts = categories.map(category => ({
      name: category,
      count: categoryCounts.find(c => c._id === category)?.count || 0
    }));
    
    res.json(formatSuccess(categoriesWithCounts, 'Categories retrieved successfully'));
    
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json(formatError('Server error fetching categories'));
  }
};

// Get trending skills
const getTrendingSkills = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const trendingSkills = await User.aggregate([
      { $match: { isActive: true, isBanned: false } },
      { $unwind: '$skillsOffered' },
      {
        $group: {
          _id: '$skillsOffered.skill',
          count: { $sum: 1 },
          avgRating: { $avg: '$rating' },
          category: { $first: '$skillsOffered.category' }
        }
      },
      { $sort: { count: -1, avgRating: -1 } },
      { $limit: parseInt(limit) },
      {
        $project: {
          skill: '$_id',
          count: 1,
          avgRating: { $round: ['$avgRating', 1] },
          category: 1,
          _id: 0
        }
      }
    ]);
    
    res.json(formatSuccess(trendingSkills, 'Trending skills retrieved successfully'));
    
  } catch (error) {
    console.error('Get trending skills error:', error);
    res.status(500).json(formatError('Server error fetching trending skills'));
  }
};

// Get detailed user profile for discovery
const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!isValidObjectId(id)) {
      return res.status(400).json(formatError('Invalid user ID', 400));
    }
    
    const user = await User.findById(id)
      .select('-password -email -reportCount -isBanned -banReason -banExpiresAt')
      .populate('skillsOffered skillsWanted');
    
    if (!user) {
      return res.status(404).json(formatError('User not found', 404));
    }
    
    if (!user.isActive || user.isBanned) {
      return res.status(404).json(formatError('User not found', 404));
    }
    
    // Add online status
    const userProfile = user.toObject();
    userProfile.isOnline = Date.now() - new Date(user.lastSeen).getTime() < 5 * 60 * 1000;
    
    res.json(formatSuccess(userProfile, 'User profile retrieved successfully'));
    
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json(formatError('Server error fetching user profile'));
  }
};

module.exports = {
  getDiscoverUsers,
  searchUsers,
  getCategories,
  getTrendingSkills,
  getUserProfile
};
