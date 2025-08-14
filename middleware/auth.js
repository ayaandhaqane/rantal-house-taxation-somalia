const jwt = require('jsonwebtoken');
// const User = require('../models/Citizen'); // your user model
const User = require('../models/User');

// exports.authenticate = async (req, res, next) => {
//   try {
//     console.log('Headers:', req.headers);
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//       return res.status(401).json({ message: 'Authentication token missing' });
//     }

//     const token = authHeader.split(' ')[1];
//     console.log('Token:', token);

//     if (!token) {
//       return res.status(401).json({ message: 'Authentication token missing' });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log('Decoded JWT:', decoded);

//     // Check for userId or _id or id in token payload
//     const userId = decoded.userId || decoded._id || decoded.id;

//     if (!userId) {
//       return res.status(401).json({ message: 'Invalid token payload: no user ID found' });
//     }

//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(401).json({ message: 'Invalid token user' });
//     }

//     req.user = user; // attach user document to req.user
//     next();
//   } catch (error) {
//     console.error('Authentication error:', error);
//     res.status(401).json({ message: 'Authentication failed' });
//   }
// };



const authMiddleware = async (req, res, next) => {
  // 1. Get token from header
  const authHeader = req.header('Authorization');
  console.log('Authorization header:', authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Make sure you have JWT_SECRET in your .env file
    console.log('Decoded token:', decoded);

    // 3. Attach user to the request object
    const user = await User.findById(decoded.id).select('-password'); // Find user by ID from token payload
    if (!user) {
      return res.status(401).json({ message: 'Invalid token. User not found.' });
    }

    req.user = user; // Attach the user object to the request
    next(); // Pass control to the next handler
  } catch (ex) {
    res.status(400).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = authMiddleware;