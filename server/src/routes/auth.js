const { verify } = require("jsonwebtoken");
const jwt = require('jsonwebtoken');

verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader == 'Bearer no') {
        console.log("not logged in ", authHeader)
        req.token = "expired"
        next()
    }
    else {
        if (authHeader) {
            const token = authHeader.split(' ')[1]; // Extract the token from the Authorization header
            jwt.verify(token, 'secret-key', (err, user) => {
                if (err) {
                    console.log("unauthorised token")
                    req.token = "expired"
                    next();
                    // return res.sendStatus(403); // Unauthorized
                }
                else {
                    req.username = user.username1;
                    req.token = token
                    console.log("valid user ", user.username1)
                    next();
                }
            });
        } else {
            console.log("unauthorised token")
            res.sendStatus(401); // Unauthorized
        }
    }
};


module.exports = verifyToken