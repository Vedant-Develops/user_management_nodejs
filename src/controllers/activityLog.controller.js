const httpStatus = require('http-status')
const catchAsync = require('../utils/catchAsync')
const { activityLogService } = require('../services')
const apiSucessResponse = require('../utils/apiResponse');

const list = catchAsync(async (req, res) => {
    const data = await activityLogService.list(req.user.id, req.query);
    res.status(httpStatus.OK).send(new apiSucessResponse(data, httpStatus.OK, 'Activity Log listed Successfully'));
})

module.exports = {
    list
}