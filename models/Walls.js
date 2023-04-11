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
    thumbnail_id: {
        type: String,
        unique: true
    },
    file_url: {
        type: String
    },
    thumbnail_url: {
        type: String
    },
    timesFavourite: {
        type: Number,
        default: 0
    },
    timesDownloaded: {
        type: Number,
        default: 0
    },
    mime_type: {
        type: String
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category"
    },
    addedBy: {
        type: String
    }
}, { timestamps: true });

module.exports = Walls = mongoose.model("walls", wallsSchema);