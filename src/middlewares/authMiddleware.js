const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader) {
        return res.status(401).send({ error: 'No token provided'});
    }

    const parts = authHeader.split(' ');
    let [ scheme, token] = parts;

    

    if(parts.length !== 2){
        token = authHeader;
        
    } else {
        if(!/^Bearer$/i.test(scheme)){
            return res.status(401).send({ error: 'Token malformatted'});
        }
    }
    
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if(err) {
            return res.status(401).send({ error: 'Invalid token'});
        }

        req.userId = decoded.id;

        return next();
    });
    
}