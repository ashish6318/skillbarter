const User = require('../models/User');
const { generateToken, formatError, formatSuccess } = require('../utils/helpers');

// Register new user
const register = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, bio, country, languages, skillsOffered, skillsWanted } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });
    
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json(formatError('User with this email already exists', 400));
      }
      if (existingUser.username === username) {
        return res.status(400).json(formatError('Username already taken', 400));
      }
    }
    
    // Create new user
    const user = new User({
      username,
      email,
      password,
      firstName,
      lastName,
      bio: bio || '',
      country: country || '',
      languages: languages || [],
      skillsOffered: skillsOffered || [],
      skillsWanted: skillsWanted || []
    });
    
    await user.save();
    
    // Generate token
    const token = generateToken(user._id);
    
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json(formatSuccess({
      user: userResponse,
      token
    }, 'User registered successfully'));
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json(formatError('Server error during registration'));
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json(formatError('Invalid credentials', 401));
    }
    
    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json(formatError('Account is deactivated', 403));
    }
    
    // Check if account is banned
    if (user.isBanned) {
      return res.status(403).json(formatError('Account is banned', 403, {
        banReason: user.banReason,
        banExpiresAt: user.banExpiresAt
      }));
    }
    
    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json(formatError('Invalid credentials', 401));
    }
    
    // Update last seen
    user.lastSeen = new Date();
    await user.save();
    
    // Generate token
    const token = generateToken(user._id);
    
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.json(formatSuccess({
      user: userResponse,
      token
    }, 'Login successful'));
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json(formatError('Server error during login'));
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('skillsOffered')
      .populate('skillsWanted');
    
    if (!user) {
      return res.status(404).json(formatError('User not found', 404));
    }
    
    res.json(formatSuccess(user, 'Profile retrieved successfully'));
    
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json(formatError('Server error retrieving profile'));
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;
    
    // Remove fields that shouldn't be updated through this endpoint
    delete updates.password;
    delete updates.email;
    delete updates.username;
    delete updates.credits;
    delete updates.rating;
    delete updates.totalReviews;
    
    const user = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json(formatError('User not found', 404));
    }
    
    res.json(formatSuccess(user, 'Profile updated successfully'));
    
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json(formatError('Server error updating profile'));
  }
};

// Logout (client-side token removal, but we can blacklist if needed)
const logout = async (req, res) => {
  try {
    // Update last seen
    await User.findByIdAndUpdate(req.user.id, { lastSeen: new Date() });
    
    res.json(formatSuccess(null, 'Logout successful'));
    
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json(formatError('Server error during logout'));
  }
};

// Forgot password (placeholder for now)
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    
    if (!user) {
      // Don't reveal if email exists
      return res.json(formatSuccess(null, 'If an account with that email exists, a password reset link has been sent'));
    }
    
    // TODO: Implement email sending logic
    // For now, just return success
    res.json(formatSuccess(null, 'Password reset link sent to your email'));
    
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json(formatError('Server error processing request'));
  }
};

// Verify email (placeholder)
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;
    
    // TODO: Implement email verification logic
    res.json(formatSuccess(null, 'Email verified successfully'));
    
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json(formatError('Server error verifying email'));
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  logout,
  forgotPassword,
  verifyEmail
};
