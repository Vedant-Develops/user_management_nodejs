const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const apiSucessResponse = require('../utils/apiResponse');

const createUser = catchAsync(async (req, res) => {
    const data = await userService.createUser({ ...req.body, parentUser: req.user.id });
    res.status(httpStatus.CREATED).send(new apiSucessResponse(data, httpStatus.CREATED), 'User Created Successfully');
})

const listUser = catchAsync(async (req, res) => {
    const data = await userService.list(req.query, req.user);
    res.status(httpStatus.OK).send(new apiSucessResponse(data, httpStatus.OK, 'User listed successfully'));
})

const updateUser = catchAsync(async (req, res) => {
    const data = await userService.updateUserById(req.params.id, req.body)
    res.status(httpStatus.OK).send(new apiSucessResponse(data, httpStatus.OK, 'User Updated successfully'))
})

const deleteUser = catchAsync(async (req, res) => {
    const data = await userService.deleteByUserId(req.params.id)
    res.status(httpStatus.OK).send(new apiSucessResponse(data, httpStatus.OK, 'User Deleted successfully'))
})

module.exports = {
    createUser,
    listUser,
    updateUser,
    deleteUser
}