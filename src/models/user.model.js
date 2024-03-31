const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const userSchema = mongoose.Schema(
    {
        isEnabled: {
            type: Boolean,
            default: false
        },
        fullName: {
            type: String,
            required: true,
            trime: true,
        },
        address: {
            type: String,
            required: false,
            trime: true,
        },
        mobile: {
            type: String,
            required: true,
            unique: true,
            validate(value) {
                if (value.length !== 10) {
                    throw new Error('Length of the mobile number needs to be 10 digits');
                }
            }
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            unique: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Invalid email');
                }
            }

        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            validate(value) {
                if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
                    throw new Error('Password must contain at least one letter and one number');
                }
            }
        },
        userType: {
            type: String,
            enum: ['superadmin', 'admin'],
            default: 'admin',
            required: true
        },
        parentUser: {
            type: mongoose.ObjectId,
            required: false
        },
        createBy: {
            type: mongoose.ObjectId,
            required: false,
            ref: 'user'
        },
        updateBy: {
            type: mongoose.ObjectId,
            required: false,
            ref: 'user'
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);


// add plugin that converts mongoose to json
userSchema.plugin(require('mongoose-aggregate-paginate-v2'));

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } })
    return !!user
}

userSchema.statics.superAdminExists = async function () {
    const user = await this.findOne({ userType: 'superadmin' })
    return !!user
}


/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
    const user = this
    return bcryptjs.compare(password, user.password)
}


/**
 * Check if User is On Some Party
 * @param {string} id - The user's id
 * @returns {Promise<boolean>}
 */

userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcryptjs.hash(user.password, 8);
    }
    next()
})


/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

User.aggregatePaginate.options = {
    customLabels: { docs: 'results', totalDocs: 'totalResults' }
}


module.exports = User;