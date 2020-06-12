const jwt = require('jsonwebtoken');

const validateToken = (authorization, callbackSuccess, callbackError) => {
    if (!authorization) 
        return callbackError('no token provided', 401);

    const parts = authorization.split(' ');

    if (!parts.length === 2)
        return callbackError(null, 'token error', 401);

    const [ scheme, token ] = parts;

    if (!/^Bearer$/i.test(scheme))
        return callbackError(null, 'token malformatted', 401);

    jwt.verify(token, 'secret', (error, decoded) => {
        if (error) 
            return callbackError(null, 'invalid token', 401);

        return callbackSuccess(decoded, 'token validated', 200);
    });
};

const authSocketIo = (socket, next) => validateToken(
    socket.request.headers['authorization'],
    () => next(),
    (_, message) => next(new Error(message))
);

module.exports = {
    authSocketIo
}

// module.exports = (req, res, next) => {
//     const authHeader = req.headers.authorization;
    
//     if (!authHeader)
//         return res.status(401).send({ error: 'no token provided' });

//     const parts = authHeader.split(' ');

//     if (!parts.length === 2)
//         return res.status(401).send({ error: 'token error' });

//     const [ scheme, token ] = parts;

//     if (!/^Bearer$/i.test(scheme))
//         return res.status(401).send({ error: 'token malformatted' });

//     jwt.verify(token, 'secret', (err, decoded) => {
//         if (err) return res.status(401).send({ error: 'invalid token' });

//         req.userId = decoded.id; 

//         return next();
//     });
// };
