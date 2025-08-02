const express = require("express")
const router = express.Router()
const _ = require("lodash")


const { Crossword, crosswordValidation } = require("../model/crosswordModel")

const { authMD, optionalAuthMD } = require("../middleware/authMD");



// delete crossword
router.delete("/:id", authMD, async (req, res) => {
    try {
        if (!req.requestingUser) return res.status(401).send({ message: "Please login first"});
        if (!req.requestingUser.isContentCreator) return res.status(403).send({ message: "You are not a content creator"});

        // Only allow deletion if the user is the crossword's creator
        const query = { _id: req.params.id, creator: req.requestingUser._id };

        const crossword = await Crossword.findOneAndDelete(query);
        if (!crossword) return res.status(404).send({ message: "Crossword not found or you are not the creator"});

        res.send({ message: "Crossword deleted", crossword: crossword });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error"});
    }
});

// edit crossword
router.put("/:id", authMD, async (req, res) => {
    // validate user input
    const error = crosswordValidation.validate(req.body);
    if (error.error) {
        return res.status(400).send({ message: error.error.details[0].message });
    }

    // validate system
    if (!req.requestingUser) return res.status(400).send({ message: "Please login first" });
    if (!req.requestingUser.isContentCreator) return res.status(400).send({ message: "You are not a content creator" });

    // Only allow updating editable fields (whitelist)
    const allowedFields = ["title", "description", "crosswordObject", "isPublic"];
    let updateFields = {};

    allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
            updateFields[field] = req.body[field];
        }
    });

    // Always keep the creator unchanged
    updateFields.creator = req.requestingUser._id;

    let crossword = await Crossword.findOneAndUpdate(
        { _id: req.params.id, creator: req.requestingUser._id },
        updateFields,
        { new: true }
    );

    if (!crossword) return res.status(404).send({ message: "Crossword not found" });

    res.send({ message: "Crossword updated", crossword });
});

// toggle like 
router.patch("/:id/like", authMD, async (req, res) => {
    // validate system
    if (!req.requestingUser) return res.status(400).send({ message: "Please login first"})

    // process
    // get crossword
    let crossword = await Crossword.findById(req.params.id)
    if (!crossword) return res.status(404).send({ message: "Crossword not found"})

    // Check if user already liked
    const userId = req.requestingUser._id;
    const userIdString = userId.toString(); // Convert to string for reliable comparison

    const userLikedIndex = crossword.likes.findIndex(id => id.toString() === userIdString);

    if (userLikedIndex > -1) {
        // User already liked, so remove the like
        crossword.likes.pull(userId);
    } else {
        // User hasn't liked, so add the like
        crossword.likes.push(userId);
    }

    // Save the updated Crossword
    await crossword.save();

    res.send({ message: "crossword updated", crossword: crossword })
})


// mark as solved
router.put("/:id/solved", authMD, async (req, res) => {
    // validate system
    if (!req.requestingUser) return res.status(400).send({ message: "Please login first"})

    // process
    // get crossword
    let crossword = await Crossword.findById(req.params.id)
    if (!crossword) return res.status(404).send({ message: "Crossword not found"})

    // Check if user already solved
    const userId = req.requestingUser._id;
    const userIdString = userId.toString(); // Convert to string for reliable comparison

    const userSolvedIndex = crossword.solved.findIndex(id => id.toString() === userIdString);

    if (userSolvedIndex > -1) {
        // User already solved, send message
        return res.status(400).send({ message: "You have already solved this crossword", crossword: crossword })
    } else {
        // User hasn't solved, so add the solve
        crossword.solved.push(userId);
    }

    // Save the updated Crossword
    await crossword.save();

    res.send({ message: "crossword updated", crossword: crossword })
})

// delete solve
router.delete("/:id/solved", authMD, async (req, res) => {
    // validate system
    if (!req.requestingUser) return res.status(400).send({ message: "Please login first"})  

    // process
    // get crossword
    let crossword = await Crossword.findById(req.params.id)
    if (!crossword) return res.status(404).send({ message: "Crossword not found"})

    // Check if user already solved
    const userId = req.requestingUser._id;
    const userIdString = userId.toString(); // Convert to string for reliable comparison

    const userSolvedIndex = crossword.solved.findIndex(id => id.toString() === userIdString);

    if (userSolvedIndex > -1) {
        // User already solved, so remove the solve
        crossword.solved.pull(userId);
    } else {
        // User hasn't solved, send message
        return res.status(400).send({ message: "You have not solved this crossword", crossword: crossword })
    }

    // Save the updated Crossword
    await crossword.save();

    res.send({ message: "crossword updated", crossword: crossword })
})

// toggle visibility
router.patch("/:id/visibility", authMD, async (req, res) => {
    // validate system
    if (!req.requestingUser) return res.status(400).send({ message: "Please login first"})

    // process
    // get crossword
    let crossword = await Crossword.findById(req.params.id)
    if (!crossword) return res.status(404).send({ message: "Crossword not found"})

    // Check if user is the creator
    if (req.requestingUser.id != crossword.creator) return res.status(400).send({ message: "You are not the creator of this crossword"})

    // Change visibility
    crossword.isPublic = !crossword.isPublic

    // Save the updated Crossword
    await crossword.save();

    res.send({ message: "crossword updated", crossword: crossword })
})

// get the requesting user crosswords
router.get("/my-crosswords", authMD, async (req, res) => {
    let crosswords = await Crossword.find({ creator: req.requestingUser._id })

    if (!crosswords) return res.status(404).send({ message: "No crosswords found"})

    res.send({ message: "Crosswords found", crosswords: crosswords })
})

// get crossword info (anyone can if public, only creator if private)
router.get("/:id", optionalAuthMD, async (req, res) => {
    let crossword = await Crossword.findById(req.params.id)

    if (!crossword) return res.status(404).send({ message: "Crossword not found"})

    
    if (!crossword.isPublic)
    {
        if (!req.requestingUser) return res.status(400).send({ message: "Please login first"})
        if (req.requestingUser.id != crossword.creator) return res.status(400).send({ message: "You are not the creator of this crossword"})
    }

    res.send({ message: "Crossword found", crossword: crossword})
})

// get all public crosswords (anyone can)
router.get("/", async (req, res) => {
    let crosswords = await Crossword.find({ isPublic: true })

    if (!crosswords) return res.status(404).send({ message: "No crosswords found"})

    res.send({ message: "Crosswords found", crosswords: crosswords})
})

// create crossword
router.post("/", authMD, async (req, res) => {
    // validate input
    const error = crosswordValidation.validate(req.body);
    if (error.error) {
        res.status(400).send({ message: error.error.details[0].message});
        return
    }

    // validate system
    if (!req.requestingUser) return res.status(400).send({ message: "Please login first"})
    if (!req.requestingUser.isContentCreator) return res.status(400).send({ message: "You are not a content creator"})

    // process: create Crossword
    crossword = await new Crossword(
        { ...req.body, creator: req.requestingUser._id }
    ).save()

    // response
    res.send({ message: "Crossword created", crossword: crossword, creatingUser: _.pick(req.requestingUser, ["name", "email", "isContentCreator", "createdAt", "_id"]) })
})

module.exports = router