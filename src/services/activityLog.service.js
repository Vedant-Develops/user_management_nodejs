const { ActivityLog } = require('../models');

const createActivityLog = async (activityLogBody) => {
    const activityLog = new ActivityLog(activityLogBody);
    await activityLog.save();
    return activityLog;
}

const list = async (userId, query) => {
    const page = query.page;
    const limit = query.limit;
    const skip = (page - 1) * limit;
    const activityLog = await ActivityLog.find({ userId: userId }).limit(limit).skip(skip);
    return {
        activityLog, page, totalCount: await ActivityLog.countDocuments({ userId: userId })
    }
}


module.exports = {
    createActivityLog,
    list
}