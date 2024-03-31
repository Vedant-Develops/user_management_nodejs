const joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const { password } = require('./custom.validation');

const changePassword = {
    body: joi.object().keys({
        password: joi.string().required(),
        newPassword: joi.string().required(password)
    })
}

const updateUserInfo = {
    body: joi.object().keys({
        email: joi.string().email(),
        fullname: joi.string(),
        mobile: joi.string()
    })
}

module.exports = {
    changePassword,
    updateUserInfo
}