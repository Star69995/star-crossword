const mongoose = require("mongoose")
const _ = require("lodash")

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255
    },
    email: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isContentCreator: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const User = mongoose.model("User", userSchema, "users")

const Joi = require("joi")

const validation = {
    userName: Joi.string().min(2).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(255).required(),
    isContentCreator: Joi.boolean()
}
const userValidation = Joi.object(validation).required()

const authValidation = Joi.object(_.pick(validation, ["email", "password"])).required()

module.exports = { User, userValidation, authValidation }