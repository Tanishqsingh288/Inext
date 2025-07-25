const User = require('../models/UserModel');

// Get all users (for Home Page)
async function getAllUsers(req, res) {
  try {
    // Exclude password from results
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
}

module.exports = {
  getAllUsers
};
