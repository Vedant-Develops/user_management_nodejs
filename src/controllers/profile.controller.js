const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { profileService } = require('../services');
const apiSucessResponse = require('../utils/apiResponse');

const userInfo = catchAsync(async (req, res) => {
    const data = await profileService.userInfo(req);
    res.status(httpStatus.OK).send(new apiSucessResponse(data, httpStatus.OK, 'User Retrieved successfully'));
})

const changePassword = catchAsync(async (req, res) => {
    const data = await profileService.changePassword(req);
    res.status(httpStatus.OK).send(new apiSucessResponse(data, httpStatus.OK, 'User Retrieved successfully'));
})

const updateUserInfo = catchAsync(async (req, res) => {
    const data = await profileService.updateUserInfo(req);
    res.status(httpStatus.OK).send(new apiSucessResponse(data, httpStatus.OK, 'Profile Updated Successfully'));
})

module.exports = {
    userInfo,
    changePassword,
    updateUserInfo
}