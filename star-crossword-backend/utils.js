// Validate requesting user
function validateUser(req, res, roles = []) {
    if (!req.requestingUser) {
        return res.status(401).send({ message: "Please login first" });
    }
    if (roles.length && !req.requestingUser.isContentCreator) {
        return res.status(403).send({ message: "Access denied" });
    }
}

// Find a document by ID and ensure the creator matches
async function findDocument(Model, id, userId, populateFields = null) {
    let q;

    if (!id && userId) {
        // No id: get all docs for the user
        q = Model.find({ creator: userId });
        if (populateFields) {
            q = q.populate(populateFields);
        }
        return await q;
    }

    // id is provided: get the single doc (optionally, only owned by the user)
    const query = userId ? { _id: id, creator: userId } : { _id: id };
    q = Model.findOne(query);
    if (populateFields) {
        q = q.populate(populateFields);
    }
    return await q;
}
module.exports = { validateUser, findDocument };