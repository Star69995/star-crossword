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
async function findDocument(Model, id, userId) {
    const query = userId ? { _id: id, creator: userId } : { _id: id };
    return await Model.findOne(query);
}

module.exports = { validateUser, findDocument };