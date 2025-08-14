const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: 'Authentication token missing' });

    const token = authHeader.split(' ')[1];
    if (!token)
      return res.status(401).json({ message: 'Authentication token missing' });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
      return res.status(401).json({ message: 'Invalid token' });
    }

    const userId = decoded.id || decoded._id;
    if (!userId) return res.status(401).json({ message: 'Invalid token payload' });

    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = user;

    // This check ensures that only the authenticated user can update their own profile
    if (req.method === 'PUT' && req.url === '/api/users/profile') {
      // Check if the user trying to update the profile is the same as the authenticated user
      if (req.user._id.toString() !== req.body.userId) {
        return res.status(403).json({ message: 'You are not authorized to update this profile' });
      }
    }

    next();
  } catch (err) {
    console.error('Authentication middleware error:', err);
    res.status(500).json({ message: 'Internal server error during authentication' });
  }
};


// middleware/authenticate.js
exports.requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  res.status(403).json({ message: 'Access denied: Admins only' });
};
