const httpStatus = require('http-status');
const logger = require('../config/logger');
const apiError = require('../utils/apiError');
const path = require('path');
const fs = require('fs');


const errorLogFilePath = path.join(__dirname, 'error.log');
const errorLogStream = fs.createWriteStream(errorLogFilePath, { flags: 'a' });


const errorConverter = (err, req, res, next) => {
    let error = err;
    if (!(error instanceof apiError)) {
        const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || httpStatus[statusCode];
        error = new apiError(statusCode, message, false, error.stack)
    }
    next(error);
}

const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;
    res.locals.errorMessage = err.message;
    const response = {
        code: statusCode,
        message,
        error: true,
        success: false,
        stack: err.stack
    }
    logger.error(err);
    errorLogStream.write(err.toString() + '\n');

    res.status(statusCode).send(response);
}

module.exports = {
    errorConverter,
    errorHandler
}