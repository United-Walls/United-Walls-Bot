const crypto = require('crypto');
const mongoose = require('mongoose');

const InviteSchema = new mongoose.Schema({
  token: {
    type: String,
    default: () => crypto.randomBytes(40).toString('hex'),
    required: true,
  },
  expiry: {
    type: Date,
    default: () => Date.now() + 10*24*60*60*1000,
    required: true,
  },
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'uploader',
  },
  used: {
    type: Boolean,
    default: false
  }
});

InviteSchema.methods.isExpired = function () {
  return Date.now() > this.expiry || this.user;
};

const Invite = mongoose.model('invite', InviteSchema);

module.exports = Invite;