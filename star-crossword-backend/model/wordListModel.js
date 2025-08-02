const _ = require("lodash")
const mongoose = require("mongoose")

const wordListSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255
    },
    description:
    {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 1024
    },
    words: [
        {
            solution: {
                type: String,
                required: true
            },
            definition: {
                type: String,
                required: true
            }
        }
    ],
    creator:
    {
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


const WordList = mongoose.model("WordList", wordListSchema, "WordLists")

const Joi = require("joi")

const wordListValidation = Joi.object({
    title: Joi.string().min(2).max(255).required(),
    description: Joi.string(),
    words: Joi.array().items(
        Joi.object({
            solution: Joi.string().required(),
            definition: Joi.string().required()
        })
    ).min(2).required(),
    isPublic: Joi.boolean(),
}).required()

module.exports = { WordList, wordListValidation }