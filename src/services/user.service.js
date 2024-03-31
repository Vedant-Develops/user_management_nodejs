const httpStatus = require('http-status');
const { User } = require('../models');
const apiError = require('../utils/apiError');
const activityLogService = require('./activityLog.service');

const createUser = async (userBody) => {
    console.log("Create user : user body", userBody);
    if (await User.isEmailTaken()) {
        throw new apiError(httpStatus.BAD_REQUEST, 'Email Already taken');
    }
    if (userBody.userType == 'superadmin' && await User.superAdminExists()) {
        throw new apiError(httpStatus.BAD_REQUEST, 'Super Admin already exists');
    }

    const user = new User(userBody);
    await user.save();
    await activityLogService.createActivityLog({ userId: user._id, message: 'User Created Successfully' });
    return user;
}


const list = async (query, user) => {
    const page = query.page;
    const limit = query.limit;
    const skip = (page - 1) * limit;
    const userList = await User.find((user.userType !== 'superadmin' ? { parentUser: user.id } : {})).limit(limit).skip(skip);
    return {
        userList,
        page,
        limit,
        totalCount: await User.countDocuments((user.userType !== 'superadmin' ? { parentUser: user.id } : {}))
    };
}

const getUserById = async (id) => {
    return await User.findById(id);
}

const getUserByEmail = async (email) => {
    return await User.findOne({ email })
}

const updateUserById = async (userId, updateBody) => {
    const user = await getUserById(userId);
    if (!user) {
        throw new apiError(httpStatus.NOT_FOUND, 'User Not Found');
    }

    if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
        throw new apiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    Object.assign(user, updateBody)
    await user.save();
    await activityLogService.createActivityLog({ userId: user._id, message: 'User Updated Successfully' });
    return user;
}

const deleteByUserId = async (userId) => {
    const user = await getUserById(userId);
    if (!user) {
        throw new apiError(httpStatus.NOT_FOUND, 'User Not Found');
    }
    await User.deleteOne({ _id: userId })
    await activityLogService.createActivityLog({ userId: user._id, message: 'User Deleted Successfully' })
    return 'User Deleted Successfully';
}

const currentPassword = async (userId, password) => {
    const user = await getUserById(userId);
    if (!user) {
        throw new apiError(httpStatus.NOT_FOUND, 'User Not Found');
    }

    if (!user || !(await user.isPasswordMatch(password))) {
        throw new apiError(httpStatus.BAD_REQUEST, 'Please enter the correct current password');
    }

    await activityLogService.createActivityLog({ userId: userId, message: "User Password Matched Successfully" });

    return user;
}

module.exports = {
    createUser,
    list,
    getUserById,
    getUserByEmail,
    updateUserById,
    deleteByUserId,
    currentPassword
}