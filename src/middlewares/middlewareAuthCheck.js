var jwt = require('jsonwebtoken');

function getTokenFromHeaders(req) {
    if(req.headers && req.headers.authorization) {
        if(req.headers.authorization.split(' ')[0] === 'Token'){
            return req.headers.authorization.split(' ')[1]
        }
    }
    return null
}

function authorizeRequest(req, res, next) {
    try {
        let token = getTokenFromHeaders(req);
        let decodedToken = jwt.verify(token, process.env.AUTH_KEY_SECRET);
        req.payload = decodedToken;
        next();
    } catch(err) {
        winston.log('error', 'Unauthorized user access attempt')
        return res. res.status(401).json('Unauthorized');
    }
}

function authorizeRequestOptional(req, res, next) {
    try{
        let token = getTokenFromHeaders(req);
        let decodedToken = jwt.verify(token, process.env.AUTH_KEY_SECRET);
        req.payload = decodedToken;
    }   catch(err) {
    }
    next();
}

module.exports = { authorizeRequest, authorizeRequestOptional }