const joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const { password } = require('./custom.validation');

const createUser = {
    body: joi.object().keys({
        fullName: joi.string().required(),
        email: joi.string().required().email(),
        mobile: joi.string().required(),
        password: joi.string().required().custom(password),
        userType: joi.string().required()
    })
}

const updateUser = {
    body: joi.object().keys({
        fullName: joi.string(),
        email: joi.string().email(),
        mobile: joi.string(),
    }),
}

module.exports = {
    createUser,
    updateUser
}