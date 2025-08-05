const express = require("express")
const router = express.Router()
const _ = require("lodash")
const bcrypt = require("bcrypt")

const { User, userValidation } = require("../model/userModel")
const { authMD, optionalAuthMD } = require("../middleware/authMD")

// הפרטים שישלחו חזרה למשתמש
const userDetails = ["userName", "email", "isContentCreator", "createdAt", "_id"]


// get the logged in user
router.get("/me", authMD, async (req, res) => {
    let user = await User.findById(req.user._id)
    res.send({ message: "User found", user: _.pick(user, userDetails) })
})

// get user info
router.get("/:id", authMD ,async (req, res) => {
    // authMD makes sure the user is authenticated

    // make sure the user is authorized to access this (either self or admin)
    // if (req.params.id !== req.user._id && !req.requestingUser.isAdmin) return 
    if (req.params.id !== req.user._id) return res.status(403).send({ message: "Access denied"})
        

    let user = await User.findById(req.params.id)
    console.log('user: ', user);

    res.send({ message: "User found", user: _.pick(user, userDetails)})
})

// // get all users (admin only)
// router.get("/", authMD, async (req, res) => {
//     if (!req.requestingUser.isAdmin) return res.status(403).send("Access denied")
//     let users = await User.find()
//     res.send(users)
// })


// update user
router.put("/:id", authMD, async (req, res) => {
    // authMD makes sure the user is authenticated

    // make sure the user is authorized to access this self
    if (req.params.id !== req.user._id) return res.status(403).send({ message: "Access denied"})

    let user = await User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })

    if (!user) return res.status(404).send({ message: "User not found"})

    res.send({message: "User updated", user: _.pick(user, userDetails)})
})

// update isContentCreator
router.patch("/:id", authMD, async (req, res) => {
    // Only allow self-editing
    if (req.params.id !== req.user._id)
        return res.status(403).send({ message: "Access denied"})

    // Only update isContentCreator property
    if (!req.body.hasOwnProperty("isContentCreator"))
        return res.status(400).send({ message: "Only 'isContentCreator' can be updated"})

    const update = {
        isContentCreator: Boolean(req.body.isContentCreator)
    }

    try {
        let user = await User.findOneAndUpdate(
            { _id: req.params.id },
            update,
            { new: true }
        )
        if (!user) return res.status(404).send({message: "User not found"})
        res.send({ message: "User updated", user: _.pick(user, userDetails)})
    } catch (err) {
        res.status(400).send({ message: "Invalid request"})
    }
})

// delete user 
router.delete("/:id", authMD, async (req, res) => {
    // authMD makes sure the user is authenticated

    // make sure the user is authorized to access this (either self or admin)
    // if (req.params.id !== req.user._id && !req.requestingUser.isAdmin) return 
    if (req.params.id !== req.user._id) return res.status(403).send({ message: "Access denied"})


    let user = await User.findByIdAndDelete(req.params.id)

    if (!user) return res.status(404).send({ message: "User not found"})

    res.send({ message: "User deleted", user: _.pick(user, userDetails)})
})

// register
router.post("/", async (req, res) => {
    console.log(req.query);

    // validate user input
    const error = userValidation.validate(req.body);
    if (error.error) {
        res.status(400).send({ message: error.error.details[0].message});
        return
    }

    // validate system
    let user = await User.findOne({ email: req.body.email })
    if (user) return res.status(400).send({ message: "User already registered"})

    // process
    user = await new User({ ...req.body, password: await bcrypt.hash(req.body.password, 12) }).save()

    // response
    res.send({ message: "User registered", user: _.pick(user, userDetails)})

})

module.exports = router