const crypto = require('crypto');
const mongoose = require('mongoose');

const twoFASchema = new mongoose.Schema({
  token: {
    type: String,
    default: () => crypto.randomInt(100000, 999999).toString(),
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'uploader',
  },
  used: {
    type: Boolean,
    default: false
  },
  expiry: {
    type: Date,
    default: () => Date.now() + 2 * 60 * 1000,
    required: true,
  },
  bearerToken: {
    type: String
  }
});

twoFASchema.methods.isExpired = function () {
  return (Date.now() > this.expiry && this.used === false) || this.user;
};

const TwoFA = mongoose.model('twofa', twoFASchema);

module.exports = TwoFA;