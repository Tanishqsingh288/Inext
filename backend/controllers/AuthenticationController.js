const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

async function registerUser(req, res) {
  try {
    const {
      firstName,
      lastName,
      dob,
      address,
      email,
      phone,
      password,
      photo
    } = req.body;

    if (!firstName || !lastName || !dob || !address || !email || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!validator.isMobilePhone(phone, 'en-IN') || phone.length !== 10) {
      return res.status(400).json({ message: 'Invalid phone number' });
    }

    const isStrong = validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1
    });

    if (!isStrong) {
      return res.status(400).json({
        message: 'Password must have 8+ characters with uppercase, lowercase, and symbol'
      });
    }

    const existing = await User.findOne({ $or: [{ email }, { phone }] });
    if (existing) {
      return res.status(400).json({ message: 'Email or phone already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      dob,
      address,
      email,
      phone,
      photo: req.body.photo,
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        photo: user.photo
      }
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  registerUser,
  loginUser,
};
