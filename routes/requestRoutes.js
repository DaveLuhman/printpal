const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware'); // Import the upload middleware
const Request = require('../models/Request'); // Import the Request model
const User = require('../models/User'); // Import the User model
const StatusChangeThread = require('../models/StatusChangeThread'); // Import the StatusChangeThread model
const { getIo } = require('../socket'); // Correctly import getIo

// Route to serve the request submission form
router.get('/requests/new', (req, res) => {
  console.log("Serving the request submission form");
  res.render('requestForm');
});

// Route to handle permalink-based request form
router.get('/requests/new/:permalink', async (req, res) => {
  try {
    const { permalink } = req.params;
    const user = await User.findOne({ permalink });

    if (!user) {
      console.log(`User not found for permalink: ${permalink}`);
      return res.status(404).send('User not found');
    }

    console.log(`Serving request form for user: ${user.username}`);
    res.render('requestForm', { user });
  } catch (error) {
    console.error('Error fetching user by permalink:', error.message);
    console.error(error.stack);
    res.status(500).send('Internal Server Error');
  }
});

// Route to handle form submission
router.post('/requests/submit', upload.single('modelFile'), async (req, res) => {
  console.log('Form submission received');
  const { name, email, modelSource, primaryColor, secondaryColor, accentColor, userId } = req.body;
  const modelFile = req.file ? req.file.filename : null;

  let errors = [];

  if (!name) errors.push('Name is required.');
  if (!email) errors.push('Email is required.');
  if (!modelSource && !modelFile) {
    errors.push('Either a model source link or a model file is required.');
  }
  if (!primaryColor) errors.push('Primary color is required.');
  if (!secondaryColor) errors.push('Secondary color is required.');
  if (!accentColor) errors.push('Accent color is required.');
  if (modelFile) {
    const allowedExtensions = ['stl', '3mf', 'step', 'obj'];
    const fileExtension = modelFile.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      errors.push('Invalid file type. Allowed types: stl, 3mf, step, obj.');
    }
  }

  if (errors.length > 0) {
    console.log('Validation errors:', errors);
    return res.status(400).render('requestForm', { errors });
  }

  console.log('File upload succeeded:', modelFile);

  const newRequest = new Request({
    name,
    email,
    modelSource,
    primaryColor,
    secondaryColor,
    accentColor,
    modelFile,
    user: userId,
    status: 'New' // Initial status
  });

  try {
    const savedRequest = await newRequest.save();
    console.log('Request saved successfully:', savedRequest);

    // Create initial status change thread entry
    console.log('Creating initial status change thread for request ID:', savedRequest._id);
    const initialStatusChangeThread = new StatusChangeThread({
      status: 'New',
      request: savedRequest._id
    });
    const savedStatusChangeThread = await initialStatusChangeThread.save();
    console.log('Initial status change thread saved successfully:', savedStatusChangeThread);

    // Update the request with the initial status change thread
    savedRequest.statusChangeThreads.push(savedStatusChangeThread._id);
    const updatedRequest = await savedRequest.save();
    console.log('Request updated with initial status change thread:', updatedRequest);

    res.render('confirmation', { request: updatedRequest });
  } catch (err) {
    console.error('Error saving request or status change thread:', err.message);
    console.error(err.stack);
    res.status(500).send('An error occurred while saving the request.');
  }
});

// Route to serve the confirmation page
router.get('/requests/confirmation', (req, res) => {
  res.render('confirmation');
});

// Route to handle status updates
router.post('/requests/update-status', async (req, res) => {
  try {
    const { requestId, newStatus } = req.body;

    // Log the incoming request
    console.log(`Received request to update status for request ID: ${requestId} to ${newStatus}`);

    // Find the request and update its status
    const request = await Request.findById(requestId);
    if (!request) {
      console.error(`Request with ID: ${requestId} not found`);
      return res.status(404).json({ error: 'Request not found' });
    }

    // Create a new status change thread entry
    console.log('Creating new status change thread entry');
    const statusChangeThread = new StatusChangeThread({
      status: newStatus,
      request: requestId,
    });

    const savedStatusChangeThread = await statusChangeThread.save();
    console.log('Status change thread saved:', savedStatusChangeThread);

    // Update the request's status and statusChangeThreads array
    console.log('Updating request status and statusChangeThreads array');
    request.status = newStatus;
    request.statusChangeThreads.push(savedStatusChangeThread._id);

    const updatedRequest = await request.save();
    console.log('Request updated:', updatedRequest);

    // Emit the update event via Socket.IO
    const io = getIo();
    io.emit('statusUpdate', { requestId, newStatus });

    res.json({ success: true });
  } catch (error) {
    console.error(`Error updating status: ${error}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;