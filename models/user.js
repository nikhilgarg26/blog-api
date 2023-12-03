const mongoose = require('mongoose')
const { createHmac, randomBytes } = require('crypto');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
        default: "/images/default.png",
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
    },
}, { timestamps: true })

userSchema.pre('save', function (next) {
    const user = this
    if (!user.isModified('password')) return

    const salt = randomBytes(16).toString()
    const password = createHmac('sha256', salt)
        .update(user.password)
        .digest('hex');

    this.salt = salt
    this.password = password

    next()
})

const User = mongoose.model('user', userSchema)

module.exports = User 