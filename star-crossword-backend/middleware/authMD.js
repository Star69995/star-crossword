const jwt = require("jsonwebtoken")
const { User } = require("../model/userModel")
const { optional } = require("joi")

// checks if the  token is valid
authMD = async (req, res, next) => {
    const token = req.header("auth-token")
    if (!token) return res.status(401).send("Access denied")
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        if (!verified) return res.status(401).send("Access denied")
        req.user = verified
        let requestingUser = await User.findById(req.user._id)
        // in case there is a valid token but the user no longer exists
        if (!requestingUser) return res.status(403).send("User not found")
        req.requestingUser = requestingUser
        next()
    } catch (err) {
        console.log(err);
        res.status(400).send(err)
    }
}

optionalAuthMD = async (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) {
        // No token provided, continue
        return next();
    }
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        if (!verified) {
            // Invalid token, ignore and treat as anonymous
            return next();
        }
        req.user = verified;
        const requestingUser = await User.findById(req.user._id);
        if (requestingUser) {
            req.requestingUser = requestingUser;
        }
        // If user not found, still proceed, treat as not logged in
        next();
    } catch (err) {
        // If token invalid or any error, treat as anonymous
        next();
    }
};


module.exports = { authMD, optionalAuthMD }