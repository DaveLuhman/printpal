const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('./middleware/authMiddleware');
const Request = require('../models/Request');
const StatusChangeThread = require('../models/StatusChangeThread');
const { getIo } = require('../socket');

// Route to serve the Kanban board
router.get('/kanban', isAuthenticated, async (req, res) => {
  try {
    const requests = await Request.find({ user: req.session.userId }).populate('statusChangeThreads');
    const lanes = {
      'New': [],
      'Accepted': [],
      'In-progress': [],
      'Finishing': [],
      'Completed': [],
      'Delivered': [],
      'Rejected': []
    };

    requests.forEach(request => {
      lanes[request.status].push(request);
    });

    res.render('kanbanBoard', { lanes });
  } catch (error) {
    console.error('Error fetching requests for Kanban board:', error.message);
    console.error(error.stack);
    res.status(500).send('Internal Server Error');
  }
});

// Route to handle status updates from the Kanban board
router.post('/kanban/update-status', isAuthenticated, async (req, res) => {
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