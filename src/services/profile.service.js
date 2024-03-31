const { userService, activityLogService } = require('../services');

const changePassword = async (req) => {
    await userService.currentPassword(req.user.id, req.body.currentPassword);
    const user = await userService.updateUserById(req.user.id, { password: req.body.newPassword });
    await activityLogService.createActivityLog({ userId: user._id, message: "User password changed successfully" });
    return { user: user };
}

const userInfo = async (req) => {
    console.log("profile info....", req);
    await activityLogService.createActivityLog({ userId: req.user._id, message: "User Info Retrieved SuccessFully" });
    return { user: req.user };
}

const updateUserInfo = async (req) => {
    const updateBody = { ...req.body, updateBy: req.user.id };
    const user = await userService.updateUserById(req.user.id, updateBody);
    await activityLogService.createActivityLog({ userId: user._id, message: "Login User Info Updated Successfully" });
    return { user: user };
}

module.exports = {
    changePassword,
    updateUserInfo,
    userInfo
}