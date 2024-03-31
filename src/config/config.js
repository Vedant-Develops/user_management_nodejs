const dotenv = require('dotenv');
const path = require('path');
const joi = require('@hapi/joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarSchema = joi.object()
    .keys({
        NODE_ENV: joi.string().required(),
        PORT: joi.number().default(3000),
        MONGODB_URI: joi.string().required().description("Mongo DB URI"),
        JWT_ACCESS_EXPIRATION_MINUTES: joi.string().required(),
        JWT_SECRET: joi.string().required(),
    })
    .unknown();

const { value: envVars, error } = envVarSchema
    .prefs({ errors: { label: "key" } })
    .validate(process.env);

if (error) {
    throw new Error(`Config Validation error: ${error.message}`);
}

module.exports = {
    env: envVars.NODE_ENV.toLowerCase(),
    port: envVars.PORT,
    mongoose: {
        url: envVars.MONGODB_URI,
        options: {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    },
    jwt: {
        accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
        secret: envVars.JWT_SECRET,
        resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    },
};