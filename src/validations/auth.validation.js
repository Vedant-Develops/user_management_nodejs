const joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const { password } = require('./custom.validation');

const register = {
    body: joi.object().keys({
        fullName: joi.string().required(),
        email: joi.string().required().email(),
        mobile: joi.string().required(),
        password: joi.string().required().custom(password),
        confirmPassword: joi.string().required().custom(password),
        userType: joi.string().required()
    })
}

const login = {
    body: joi.object().keys({
        email: joi.string().required(),
        password: joi.string().required()
    })
}


module.exports = {
    register,
    login
}