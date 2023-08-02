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
    password: {
        type: String
    },
    description: {
        type: String
    },
    socialMediaLinks: {
        twitter: {
            type: String
        },
        instagram: {
            type: String
        },
        mastodon: {
            type: String
        },
        facebook: {
            type: String
        },
        threads: {
            type: String
        },
        steam: {
            type: String
        },
        linkedIn: {
            type: String
        },
        link: {
            type: String
        },
        other: [
            {
                title: { type: String },
                link: { type: String }
            }
        ]
    },
    donationLinks: {
        paypal: {
            type: String
        },
        patreon: {
            type: String
        },
        otherdonations: [
            {
                title: { type: String },
                link: { type: String }
            }
        ]
    },
    walls: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'walls'
        }
    ]
});

module.exports = Uploader = mongoose.model('uploader', UploaderSchema);