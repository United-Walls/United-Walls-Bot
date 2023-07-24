const jwt = require('jsonwebtoken');
const tokenkey = process.env.TOKEN_KEY;

const verifyToken = ( req, res, next ) => {
    let token = req.body.token || req.query.token || req.headers['authorization'] || req.headers['Authorization'];

    if (!token) {
        console.log("No Token")
        return res.status(403).send("Ok who the fuck? Bro are you lost? If you got this message, it means you either fucked up something, don't have the necessary stuff I need, aren't authorized, or you just a plain dumbass. Now Fuck OFF!")
    }

    try {
        token = token.replace(/^Bearer\s+/, "");
        const decoded = jwt.verify(token, tokenkey);
        req.user = decoded;
        next();
    } catch (err) {
        console.log("Other Error", err)
        return res.status(401).send("Ok who the fuck? Bro are you lost? If you got this message, it means you either fucked up something, don't have the necessary stuff I need, aren't authorized, or you just a plain dumbass. Now Fuck OFF!")
    }
}

module.exports = verifyToken;