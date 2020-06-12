const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'text is required'],
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    modifiedAt: {
		type: Date, 
        default: Date.now,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
});

module.exports = mongoose.model('Message', MessageSchema);
