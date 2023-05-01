const mongoose = require('mongoose');

const collectionsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    walls: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'walls'
        }
    ]
});

module.exports = Collections = mongoose.model("collections", collectionsSchema);