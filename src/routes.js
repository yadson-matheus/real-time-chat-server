const express = require('express');

const { authApi } = require('./middlewares/auth');

const UserController = require('./controllers/UserController');
//const MessageController = require('./controllers/MessageController');

const routes = express.Router();

routes.post('/user/create', UserController.add);
routes.post('/authenticate', UserController.authenticate);

//routes.post('/message/send', authMiddleware, MessageController.send);

module.exports = routes;
