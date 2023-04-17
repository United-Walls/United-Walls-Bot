const mongoose = require('mongoose');

const wallOfDaySchema = new mongoose.Schema({
    wall: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'walls',
        unique: true
    }
}, { timestamps: true });

module.exports = WallOfDay = mongoose.model('wallOfDay', wallOfDaySchema);