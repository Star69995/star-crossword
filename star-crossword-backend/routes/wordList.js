const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { WordList, wordListValidation } = require("../model/wordListModel");
const { authMD, optionalAuthMD } = require("../middleware/authMD");
const { validateUser, findDocument } = require("../utils");

const findDocumentAndResponse = async (id, userId, res) => {
    const wordlist = await findDocument(
        WordList,
        id,
        userId,
        { path: "creator", select: "userName" }
    );
    if (!wordlist) {
        res.status(404).send({ message: "Word list not found or you are not the creator" });
        return
    }

    return wordlist// If found, return (router will use it)
};

// DELETE wordlist
router.delete("/:id", authMD, async (req, res) => {
    validateUser(req, res, ["contentCreator"]);

    const wordlist = await WordList.findOneAndDelete({ _id: req.params.id, creator: req.requestingUser._id });

    if (!wordlist) {
        return res.status(404).send({ message: "Word list not found or you are not the creator" });
    }

    res.send({ message: "Word list deleted", wordlist });
});

// PUT edit wordlist
router.put("/:id", authMD, async (req, res) => {
    validateUser(req, res, ["contentCreator"]);

    const { error } = wordListValidation.validate(req.body);
    if (error) {
        return res.status(400).send({ message: error.details[0].message });
    }

    const allowedFields = ["title", "description", "words", "isPublic"];
    const updateFields = _.pick(req.body, allowedFields);
    updateFields.creator = req.requestingUser._id;

    const wordlist = await WordList.findOneAndUpdate(
        { _id: req.params.id, creator: req.requestingUser._id },
        updateFields,
        { new: true }
    );

    if (!wordlist) return res.status(404).send({ message: "Word list not found" });

    res.send({ message: "Word list updated", wordlist });
});

// PATCH toggle like
router.patch("/:id/like", authMD, async (req, res) => {
    validateUser(req, res);

    const wordlist = await findDocument(WordList, req.params.id);
    if (!wordlist) return res.status(404).send({ message: "Word list not found" });

    const userId = req.requestingUser._id.toString();

    wordlist.likes.includes(userId)
        ? wordlist.likes.remove(userId)
        : wordlist.likes.push(userId);

    await wordlist.save();
    res.send({ message: "Word list updated", wordlist });
});

// PATCH toggle visibility
router.patch("/:id/visibility", authMD, async (req, res) => {
    validateUser(req, res);

    const wordlist = await findDocument(WordList, req.params.id, req.requestingUser._id);
    if (!wordlist) return res.status(404).send({ message: "Word list not found" });

    wordlist.isPublic = !wordlist.isPublic;
    await wordlist.save();
    res.send({ message: "Word list updated", wordlist });
});

// GET user wordlists
router.get("/my-wordlists", authMD, async (req, res) => {
    const wordlists = await findDocumentAndResponse(null, req.requestingUser._id, res);
    if (!wordlists) return;

    const count = wordlists.length;

    if (!count) return res.status(404).send({ message: "No word lists found" });

    res.send({ message: `Word lists found: ${count}`, wordlists });
});

// GET wordlist info
router.get("/:id", optionalAuthMD, async (req, res) => {
    const wordlists = await findDocumentAndResponse(null, req.params.id, res);
    if (!wordlists) return;

    if (!wordlist.isPublic && (!req.requestingUser || req.requestingUser._id !== wordlist.creator.toString())) {
        return res.status(403).send({ message: "Access denied" });
    }

    res.send({ message: "Word list found", wordlist });
});

// GET all public wordlists
router.get("/", async (req, res) => {
    const wordlists = await WordList.find({ isPublic: true }).populate("creator", "userName");
    const count = wordlists.length;

    if (!count) return res.status(404).send({ message: "No word lists found" });

    res.send({ message: `Word lists found: ${count}`, wordlists });
});

// POST create wordlist
router.post("/", authMD, async (req, res) => {
    validateUser(req, res, ["contentCreator"]);

    const { error } = wordListValidation.validate(req.body);
    if (error) {
        return res.status(400).send({ message: error.details[0].message });
    }

    const wordlist = await new WordList({ ...req.body, creator: req.requestingUser._id }).save();

    res.send({
        message: "Word list created",
        wordlist,
        creatingUser: _.pick(req.requestingUser, ["name", "email", "isContentCreator", "createdAt", "_id"]),
    });
});

module.exports = router;