const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 100
  },
  albumId: {
    type: String,
    required: true
  },
  img_name: {
    type: String,
    default: '/images/default-album.jpg'
  },
  releaseDate: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 500
  },
  type: {
    type: String,
    required: true,
    enum: ['Mini Album', 'Studio Album', 'Single', 'EP']
  },
  tracks: [{
    type: String,
    required: true,
    minlength: 1,
    maxlength: 100
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Album', albumSchema);