const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const authResponse = (user) => ({
  token: generateToken(user._id),
  user: { id: user._id, name: user.name, email: user.email, role: user.role }
});

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    }

    const user = await User.create({ name, email, password, role: 'student' });
    return res.status(201).json(authResponse(user));
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    return res.json(authResponse(user));
  } catch (error) {
    return next(error);
  }
};

module.exports = { register, login };
