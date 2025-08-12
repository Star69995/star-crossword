const _ = require("lodash")
const mongoose = require("mongoose")

const crosswordSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255
    },
    description:
    {
        type: String,
        required: false,
    },
    crosswordObject: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId], // מערך של ObjectId
        ref: "User", // מצביע למודל "User"
        default: []
    },
    solved: {
        type: [mongoose.Schema.Types.ObjectId], // מערך של ObjectId
        ref: "User", // מצביע למודל "User"
        default: []
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Crossword = mongoose.model("Crossword", crosswordSchema, "crosswords")

const Joi = require("joi")

const crosswordValidation = Joi.object({
    title: Joi.string().min(2).max(255).required(),
    description: Joi.string(),
    crosswordObject: Joi.object(),
    isPublic: Joi.boolean(),
}).required()

module.exports = { Crossword, crosswordValidation }