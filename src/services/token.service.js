const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { Token } = require('../models');

const generateToken = (userId, expires, secret = config.jwt.secret) => {
    const payload = {
        sub: userId,
        iat: new Date().getTime(),
        exp: new Date(expires).getTime()
    }
    return jwt.sign(payload, secret);
}

const saveToken = async (
    token,
    userId,
    expires,
    type,
    blacklisted = false
) => {
    const tokenDoc = new Token({
        token,
        user: userId,
        expires,
        type,
        blacklisted
    });
    await tokenDoc.save();
    return tokenDoc;
}


const verifyToken = async (token, type) => {
    const payload = jwt.verify(token, config.jwt.secret);
    const tokenDoc = await Token.findOne({ token, type, user: payload.sub, blacklisted: false })
    if (!tokenDoc) {
        throw new Error('Token Not Found');
    }
    return tokenDoc
}

const generateAuthTokens = async (userId) => {
    const currentDate = new Date();
    //calculate access token expiration time
    const accessTokenExpires = new Date(
        currentDate.getTime() + config.jwt.accessExpirationMinutes * 60 * 1000
    );

    const accessToken = generateToken(userId, accessTokenExpires);
    //calculate refresh token expiration
    const refreshTokenExpires = new Date(
        currentDate.getTime() + 600 * 24 * 60 * 1000
    );

    const refreshToken = generateToken(userId, refreshTokenExpires)

    await saveToken(
        refreshToken,
        userId,
        refreshTokenExpires,
        'refresh',
        false
    );

    return {
        access: {
            token: accessToken,
            expires: accessTokenExpires
        },
        refresh: {
            token: refreshToken,
            expires: refreshTokenExpires
        }
    };
}

module.exports = {
    generateToken,
    saveToken,
    verifyToken,
    generateAuthTokens
}