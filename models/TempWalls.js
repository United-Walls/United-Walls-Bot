const mongoose = require('mongoose');

const TempWallsSchema = new mongoose.Schema({
    wall: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'walls'
    },
    messageID: {
        type: Number
    },
}, { timestamps: true });

module.exports = TempWalls = mongoose.model('tempwalls', TempWallsSchema);