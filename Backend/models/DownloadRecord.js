const mongoose = require('mongoose');

const downloadRecordSchema = new mongoose.Schema({
  visitorId: {
    type: String,
    required: true,
    index: true
  },
  platform: {
    type: String,
    required: true,
    enum: ['YouTube', 'Facebook', 'Instagram', 'X'],
    index: true
  },
  url: {
    type: String,
    required: true
  },
  videoTitle: {
    type: String,
    default: 'Unknown'
  },
  format: {
    type: String,
    default: 'mp4'
  },
  quality: {
    type: String,
    default: 'best'
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending',
    index: true
  },
  errorMessage: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Index for efficient queries
downloadRecordSchema.index({ createdAt: -1 });
downloadRecordSchema.index({ platform: 1, createdAt: -1 });

module.exports = mongoose.model('DownloadRecord', downloadRecordSchema);
