const mongoose = require('mongoose');

const chatIDSSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'uploader',
  },
  chatID: {
    type: Number,
  },
});

const ChatIDs = mongoose.model('chatid', chatIDSSchema);

module.exports = ChatIDs;