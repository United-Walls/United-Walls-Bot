const mongoose = require('mongoose');

const UploaderSchema = new mongoose.Schema({
    userID: {
        type: Number,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    avatar_file_url: {
        type: String
    },
    avatar_uuid: {
        type: String
    },
    avatar_mime_type: {
        type: String
    },
    walls: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'walls'
        }
    ]
});

module.exports = Uploader = mongoose.model('uploader', UploaderSchema);