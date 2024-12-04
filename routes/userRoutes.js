const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Route to handle user-specific permalink
router.get('/user/:permalink', async (req, res) => {
  try {
    const { permalink } = req.params;
    const user = await User.findOne({ permalink });

    if (!user) {
      console.log(`User not found for permalink: ${permalink}`);
      return res.status(404).send('User not found');
    }

    console.log(`User found for permalink: ${permalink}`);
    res.render('userProfile', { user });
  } catch (error) {
    console.error('Error fetching user by permalink:', error.message);
    console.error(error.stack);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;