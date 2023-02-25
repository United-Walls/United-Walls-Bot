const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
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

module.exports = Category = mongoose.model('category', categorySchema);