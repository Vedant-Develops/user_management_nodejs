const mongoose = require("mongoose");

const activityLogSchema = mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    },
    error: {
        type: Boolean,
        default: false
    },
    message: {
        type: String
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
})


// add plugin that converts mongoose to json
activityLogSchema.plugin(require('mongoose-aggregate-paginate-v2'))

/**
 * @typedef ActivityLog
 */

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
module.exports = ActivityLog;
