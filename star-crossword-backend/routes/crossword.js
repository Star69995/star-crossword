// crosswordRoutes.js
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { Crossword, crosswordValidation } = require("../model/crosswordModel");
const { authMD, optionalAuthMD } = require("../middleware/authMD");
const { validateUser, findDocument } = require("../utils");

// DELETE crossword
router.delete("/:id", authMD, async (req, res) => {
    validateUser(req, res, ["contentCreator"]);

    const crossword = await findDocument(Crossword, req.params.id, req.requestingUser._id);

    if (!crossword) {
        return res.status(404).send({ message: "Crossword not found or you are not the creator" });
    }

    await crossword.remove();
    res.send({ message: "Crossword deleted", crossword });
});

// PUT edit crossword
router.put("/:id", authMD, async (req, res) => {
    validateUser(req, res, ["contentCreator"]);

    const { error } = crosswordValidation.validate(req.body);
    if (error) {
        return res.status(400).send({ message: error.details[0].message });
    }

    const allowedFields = ["title", "description", "crosswordObject", "isPublic"];
    const updateFields = _.pick(req.body, allowedFields);
    updateFields.creator = req.requestingUser._id;

    const crossword = await Crossword.findOneAndUpdate(
        { _id: req.params.id, creator: req.requestingUser._id },
        updateFields,
        { new: true }
    );

    if (!crossword) return res.status(404).send({ message: "Crossword not found" });

    res.send({ message: "Crossword updated", crossword });
});

// PATCH toggle like
router.patch("/:id/like", authMD, async (req, res) => {
    validateUser(req, res);

    const crossword = await findDocument(Crossword, req.params.id);
    if (!crossword) return res.status(404).send({ message: "Crossword not found" });

    const userId = req.requestingUser._id.toString();

    crossword.likes.includes(userId)
        ? crossword.likes.remove(userId)
        : crossword.likes.push(userId);

    await crossword.save();
    res.send({ message: "Crossword updated", crossword });
});

// PUT mark as solved
router.put("/:id/solved", authMD, async (req, res) => {
    validateUser(req, res);

    const crossword = await findDocument(Crossword, req.params.id);
    if (!crossword) return res.status(404).send({ message: "Crossword not found" });

    const userId = req.requestingUser._id.toString();

    if (!crossword.solved.includes(userId)) {
        crossword.solved.push(userId);
        await crossword.save();
        res.send({ message: "Crossword updated", crossword });
    } else {
        return res.status(400).send({ message: "Already solved", crossword });
    }
});

// DELETE solve
router.delete("/:id/solved", authMD, async (req, res) => {
    validateUser(req, res);

    const crossword = await findDocument(Crossword, req.params.id);
    if (!crossword) return res.status(404).send({ message: "Crossword not found" });

    const userId = req.requestingUser._id.toString();

    if (crossword.solved.includes(userId)) {
        crossword.solved.remove(userId);
        await crossword.save();
        res.send({ message: "Crossword updated", crossword });
    } else {
        return res.status(400).send({ message: "Not solved yet", crossword });
    }
});

// PATCH toggle visibility
router.patch("/:id/visibility", authMD, async (req, res) => {
    validateUser(req, res);

    const crossword = await findDocument(Crossword, req.params.id, req.requestingUser._id);
    if (!crossword) return res.status(404).send({ message: "Crossword not found" });

    crossword.isPublic = !crossword.isPublic;
    await crossword.save();
    res.send({ message: "Crossword updated", crossword });
});

// GET user crosswords
router.get("/my-crosswords", authMD, async (req, res) => {
    const crosswords = await Crossword.find({ creator: req.requestingUser._id });
    const count = crosswords.length;

    if (!count) return res.status(404).send({ message: "No crosswords found" });

    res.send({ message: `Crosswords found: ${count}`, crosswords });
});

// GET a crossword info
router.get("/:id", optionalAuthMD, async (req, res) => {
    const crossword = await Crossword.findById(req.params.id);
    if (!crossword) return res.status(404).send({ message: "Crossword not found" });

    if (!crossword.isPublic && (!req.requestingUser || req.requestingUser._id !== crossword.creator.toString())) {
        return res.status(403).send({ message: "Access denied" });
    }

    res.send({ message: "Crossword found", crossword });
});

// GET all public crosswords
router.get("/", async (req, res) => {
    const crosswords = await Crossword.find({ isPublic: true });
    const count = crosswords.length;

    if (!count) return res.status(404).send({ message: "No crosswords found" });

    res.send({ message: `Crosswords found: ${count}`, crosswords });
});

// POST create crossword
router.post("/", authMD, async (req, res) => {
    validateUser(req, res, ["contentCreator"]);

    const { error } = crosswordValidation.validate(req.body);
    if (error) {
        return res.status(400).send({ message: error.details[0].message });
    }

    const crossword = await new Crossword({ ...req.body, creator: req.requestingUser._id }).save();

    res.send({
        message: "Crossword created",
        crossword,
        creatingUser: _.pick(req.requestingUser, ["name", "email", "isContentCreator", "createdAt", "_id"]),
    });
});

module.exports = router;