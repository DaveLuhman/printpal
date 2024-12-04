const mongoose = require('mongoose');

const statusChangeThreadSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['New', 'Accepted', 'In-progress', 'Finishing', 'Completed', 'Delivered', 'Rejected'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  request: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request',
    required: true
  }
});

statusChangeThreadSchema.pre('save', function(next) {
  console.log('Saving status change thread:', this);
  next();
});

const StatusChangeThread = mongoose.model('StatusChangeThread', statusChangeThreadSchema);

module.exports = StatusChangeThread;