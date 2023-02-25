const mongoose = require('mongoose');

const wallsSchema = new mongoose.Schema({
    file_name: {
        type: String,
        unique: true
    },
    file_id: {
        type: String,
        unique: true
    },
    mime_type: {
        type: String
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category"
    }
}, { timestamps: true });

module.exports = Walls = mongoose.model("walls", wallsSchema);