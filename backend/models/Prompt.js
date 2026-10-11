
const mongoose = require('mongoose');

const promptSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 120
  },
  prompt: {
    type: String,
    required: true,
    maxLength: 12000
  },
  description: {
    type: String,
    default: '',
    maxLength: 500
  },
  type: {
    type: String,
    enum: ['image', 'video', 'text'],
    default: 'image'
  },
  category: {
    type: String,
    default: 'Other',
    trim: true
  },

  // Image information
  imageUrl: {
    type: String,
    default: ''
  },
  imageSourceUrl: {
    type: String,
    default: ''
  },
  imageAuthor: {
    type: String,
    default: ''
  },
  imageLicense: {
    type: String,
    default: ''
  },

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  likes: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  approved: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Prompt', promptSchema);
