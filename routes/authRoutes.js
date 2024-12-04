const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const router = express.Router();

router.get('/auth/register', (req, res) => {
  res.render('register');
});

router.post('/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const permalink = generatePermalink(username); // Generate unique permalink based on username
    // User model will automatically hash the password using bcrypt
    await User.create({ username, password, permalink });
    console.log(`User registered with permalink: ${permalink}`); // Log permalink generation
    res.redirect('/auth/login');
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).send(error.message);
  }
});

router.get('/auth/login', (req, res) => {
  res.render('login');
});

router.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send('User not found');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      req.session.userId = user._id;
      console.log(`User logged in: ${username}`); // Log successful login
      return res.redirect(`/user/${user.permalink}`);
    } else {
      return res.status(400).send('Password is incorrect');
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).send(error.message);
  }
});

router.get('/auth/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error during session destruction:', err); // Log session destruction error
      return res.status(500).send('Error logging out');
    }
    console.log('User logged out'); // Log successful logout
    res.redirect('/auth/login');
  });
});

// Function to generate a unique permalink based on the username
function generatePermalink(username) {
  return username.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now();
}

module.exports = router;