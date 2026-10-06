const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  visitorId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  firstVisit: {
    type: Date,
    default: Date.now
  },
  lastVisit: {
    type: Date,
    default: Date.now
  },
  totalRequests: {
    type: Number,
    default: 1
  },
  platforms: [{
    type: String,
    enum: ['YouTube', 'Facebook', 'Instagram', 'X']
  }]
});

// Update lastVisit on each request
visitorSchema.pre('save', function (next) {
  this.lastVisit = new Date();
  this.totalRequests += 1;
  next();
});

module.exports = mongoose.model('Visitor', visitorSchema);
