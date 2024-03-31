const httpstatus = require('http-status');
const { userService, activityLogService, tokenService } = require('../services');
const apiError = require('../utils/apiError');

const registerUser = async (body) => {
    const user = await userService.createUser(body);

    const tokens = await tokenService.generateAuthTokens(user.id);
    await activityLogService.createActivityLog({ userId: user._id, message: "User Registered In Succesfully" });

    return { user, tokens };
}

const loginUserWithEmailAndPassword = async (req) => {
    const { email, password } = req.body;
    const user = await userService.getUserByEmail(email);
    if (!user || !(await user.isPasswordMatch(password))) {
        throw new apiError(httpstatus.BAD_REQUEST, 'Incorrect email or password');
    }

    const tokens = await tokenService.generateAuthTokens(user.id);

    await activityLogService.createActivityLog({ userId: user._id, message: "User Logged In Succesfully" });
    return { user, tokens };
}

module.exports = {
    registerUser,
    loginUserWithEmailAndPassword
}