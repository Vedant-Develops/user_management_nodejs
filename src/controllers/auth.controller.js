const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const apiSucessResponse = require('../utils/apiResponse');
const authService = require('../services/auth.service');

const register = catchAsync(async (req, res) => {
    const data = await authService.registerUser(req.body);
    res.status(httpStatus.CREATED).send(new apiSucessResponse(data, httpStatus.CREATED, 'User registered Successfully'));
});

const login = catchAsync(async (req, res) => {
    const user = await authService.loginUserWithEmailAndPassword(req);
    res.send(user);
})


module.exports = {
    register, login
}
