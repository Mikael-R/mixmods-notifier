const mongoose = require('mongoose');

const channelSchema = mongoose.Schema({
    channelId: {
        type: String,
        require: true,
    },
    isTimerOn: {
        type: Boolean,
        default: false,
    },
    lastTitleReceived: {
        type: String
    }
})

const Channel = mongoose.model('channels', channelSchema);
module.exports = Channel