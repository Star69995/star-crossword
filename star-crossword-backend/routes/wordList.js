const express = require("express")
const router = express.Router()
const _ = require("lodash")


const { WordList, wordListValidation } = require("../model/wordListModel")

const { authMD, optionalAuthMD } = require("../middleware/authMD");



// delete wordlist
router.delete("/:id", authMD, async (req, res) => {
    try {
        if (!req.requestingUser) return res.status(401).send({ message: "Please login first" });
        if (!req.requestingUser.isContentCreator) return res.status(403).send({ message: "You are not a content creator" });

        // Only allow deletion if the user is the wordlist's creator
        const query = { _id: req.params.id, creator: req.requestingUser._id };

        const wordlist = await WordList.findOneAndDelete(query);
        if (!wordlist) return res.status(404).send({ message: "Word list not found or you are not the creator" });

        res.send({ message: "Word list deleted", wordlist: wordlist });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// edit wordlist
router.put("/:id", authMD, async (req, res) => {
    // validate user input
    const error = wordListValidation.validate(req.body);
    if (error.error) {
        return res.status(400).send({ message: error.error.details[0].message });
    }

    // validate system
    if (!req.requestingUser) return res.status(400).send({ message: "Please login first" });
    if (!req.requestingUser.isContentCreator) return res.status(400).send({ message: "You are not a content creator" });

    // Only allow updating editable fields (whitelist)
    const allowedFields = ["title", "description", "words", "isPublic"];
    let updateFields = {};

    allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
            updateFields[field] = req.body[field];
        }
    });

    // Always keep the creator unchanged
    updateFields.creator = req.requestingUser._id;

    let wordlist = await WordList.findOneAndUpdate(
        { _id: req.params.id, creator: req.requestingUser._id },
        updateFields,
        { new: true }
    );

    if (!wordlist) return res.status(404).send({ message: "Word list not found" });

    res.send({ message: "Word list updated", wordlist });
});

// toggle like 
router.patch("/:id/like", authMD, async (req, res) => {
    // validate system
    if (!req.requestingUser) return res.status(400).send({ message: "Please login first" })

    // process
    // get wordlist
    let wordlist = await WordList.findById(req.params.id)
    if (!wordlist) return res.status(404).send({ message: "Word list not found" })

    // Check if user already liked
    const userId = req.requestingUser._id;
    const userIdString = userId.toString(); // Convert to string for reliable comparison

    const userLikedIndex = wordlist.likes.findIndex(id => id.toString() === userIdString);

    if (userLikedIndex > -1) {
        // User already liked, so remove the like
        wordlist.likes.pull(userId);
    } else {
        // User hasn't liked, so add the like
        wordlist.likes.push(userId);
    }

    // Save the updated WordList
    await wordlist.save();

    res.send({ message: "word list updated", wordlist: wordlist })
})


// mark as solved
router.put("/:id/solved", authMD, async (req, res) => {
    // validate system
    if (!req.requestingUser) return res.status(400).send({ message: "Please login first" })

    // process
    // get wordlist
    let wordlist = await WordList.findById(req.params.id)
    if (!wordlist) return res.status(404).send({ message: "Word list not found" })

    // Check if user already solved
    const userId = req.requestingUser._id;
    const userIdString = userId.toString(); // Convert to string for reliable comparison

    const userSolvedIndex = wordlist.solved.findIndex(id => id.toString() === userIdString);

    if (userSolvedIndex > -1) {
        // User already solved, send message
        return res.status(400).send({ message: "You have already solved this word list", wordlist: wordlist })
    } else {
        // User hasn't solved, so add the solve
        wordlist.solved.push(userId);
    }

    // Save the updated WordList
    await wordlist.save();

    res.send({ message: "word list updated", wordlist: wordlist })
})

// delete solve
router.delete("/:id/solved", authMD, async (req, res) => {
    // validate system
    if (!req.requestingUser) return res.status(400).send({ message: "Please login first" })

    // process
    // get wordlist
    let wordlist = await WordList.findById(req.params.id)
    if (!wordlist) return res.status(404).send({ message: "Word list not found" })

    // Check if user already solved
    const userId = req.requestingUser._id;
    const userIdString = userId.toString(); // Convert to string for reliable comparison

    const userSolvedIndex = wordlist.solved.findIndex(id => id.toString() === userIdString);

    if (userSolvedIndex > -1) {
        // User already solved, so remove the solve
        wordlist.solved.pull(userId);
    } else {
        // User hasn't solved, send message
        return res.status(400).send({ message: "You have not solved this word list", wordlist: wordlist })
    }

    // Save the updated WordList
    await wordlist.save();

    res.send({ message: "word list updated", wordlist: wordlist })
})

// toggle visibility
router.patch("/:id/visibility", authMD, async (req, res) => {
    // validate system
    if (!req.requestingUser) return res.status(400).send({ message: "Please login first" })

    // process
    // get wordlist
    let wordlist = await WordList.findById(req.params.id)
    if (!wordlist) return res.status(404).send({ message: "Word list not found" })

    // Check if user is the creator
    if (req.requestingUser.id != wordlist.creator) return res.status(400).send({ message: "You are not the creator of this word list" })

    // Change visibility
    wordlist.isPublic = !wordlist.isPublic

    // Save the updated WordList
    await wordlist.save();

    res.send({ message: "Word list updated", wordlist: wordlist })
})

// get the requesting user wordlists
router.get("/my-wordlists", authMD, async (req, res) => {
    let wordlists = await WordList.find({ creator: req.requestingUser._id })

    if (!wordlists) return res.status(404).send({ message: "No word lists found" })

    res.send({ message: "Word lists found", wordlists: wordlists })
})

// get wordlist info (anyone can if public, only creator if private)
router.get("/:id", optionalAuthMD, async (req, res) => {
    let wordlist = await WordList.findById(req.params.id)

    if (!wordlist) return res.status(404).send({ message: "Word list not found" })


    if (!wordlist.isPublic) {
        if (!req.requestingUser) return res.status(400).send({ message: "Please login first" })
        if (req.requestingUser.id != wordlist.creator) return res.status(400).send({ message: "You are not the creator of this word list" })
    }

    res.send({ message: "Word list found", wordlist: wordlist })
})

// get all public wordlists (anyone can)
router.get("/", async (req, res) => {
    let wordlists = await WordList.find({ isPublic: true })

    if (!wordlists) return res.status(404).send({ message: "No word lists found" })

    res.send({ message: "Word lists found", wordlists: wordlists })
})

// create wordlist
router.post("/", authMD, async (req, res) => {
    // validate input
    const error = wordListValidation.validate(req.body);
    if (error.error) {
        res.status(400).send({ message: error.error.details[0].message });
        return
    }

    // validate system
    if (!req.requestingUser) return res.status(400).send({ message: "Please login first" })
    if (!req.requestingUser.isContentCreator) return res.status(400).send({ message: "You are not a content creator" })

    // process: create WordList
    wordlist = await new WordList(
        { ...req.body, creator: req.requestingUser._id }
    ).save()

    // response
    res.send({ message: "Word list created", wordlist: wordlist, creatingUser: _.pick(req.requestingUser, ["name", "email", "isContentCreator", "createdAt", "_id"]) })
})

module.exports = router