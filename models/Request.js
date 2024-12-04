const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  modelSource: {
    type: String,
    validate: {
      validator: function(value) {
        return this.modelFile || value;
      },
      message: 'Either a model source link or a model file is required.'
    }
  },
  primaryColor: { type: String, required: true },
  secondaryColor: { type: String, required: true },
  accentColor: { type: String, required: true },
  modelFile: {
    type: String,
    validate: {
      validator: function(value) {
        return this.modelSource || value;
      },
      message: 'Either a model source link or a model file is required.'
    }
  },
  status: {
    type: String,
    enum: ['New', 'Accepted', 'In-progress', 'Finishing', 'Completed', 'Delivered', 'Rejected'],
    default: 'New'
  },
  createdAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  statusChangeThreads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StatusChangeThread' }] // Add reference to StatusChangeThread model
});

requestSchema.pre('save', function(next) {
  console.log('Saving request:', this);
  next();
});

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;