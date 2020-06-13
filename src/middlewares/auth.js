const jwt = require('jsonwebtoken');

const tokenValidation = (authorization, callback) => {
    if (!authorization) 
        return callback(null, { code: 401, message: 'no token provided' });

    const parts = authorization.split(' ');

    if (!parts.length === 2)
        return callback(null, { code: 401, message: 'token error' });

    const [ scheme, token ] = parts;

    if (!/^Bearer$/i.test(scheme))
        return callback(null, { code: 401, message: 'token malformatted' });

    jwt.verify(token, 'secret', (error, decoded) => {
        if (error) 
            return callback(null, { code: 401, message: 'invalid token' });

        return callback(decoded, null);
    });
};

const authSocketIo = (socket, next) => tokenValidation(
    socket.request.headers['authorization'],
    (_, error) => {
        if (error) 
            return next(new Error(error.message));

        return next()
    }
);

const authApi = (request, response, next) => tokenValidation(
    request.headers.authorization,
    (decoded, error) => {
        if (error) 
            return response
                .status(error.code)
                .send({ error: error.message });

        request.userId = decoded.id;

        return next()
    }
);

module.exports = {
    authSocketIo,
    authApi,
}
