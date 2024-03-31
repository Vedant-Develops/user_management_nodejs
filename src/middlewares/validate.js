const joi = require('@hapi/joi');
const httpstatus = require('http-status');
const pick = require('../utils/pick');
const apiError = require('../utils/apiError');


const validate = (schema) => (req, res, next) => {
    const validSchema = pick(schema, ['params', 'query', 'body']);
    const object = pick(req, Object.keys(validSchema));
    const { value, error } = joi.compile(validSchema)
        .prefs({ errors: { label: 'key' } })
        .validate(object);

    if (error) {
        const errorMessage = error.details.map((details) => details.message).join(',');
        return next(new apiError(httpstatus.BAD_REQUEST, errorMessage));
    }
    Object.assign(req, value);
    return next();
}

module.exports = validate;