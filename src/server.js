const express = require('express');
const app = express();
const server = require('http').createServer(app);

const { authSocketIo } = require('./middlewares/auth');

const origins = ['http://localhost:3000'];

const io = require('socket.io')(server, {
    origins: (origin, callback) => {
        if (!origins.includes(origin)) {
            callback('origin not authorized', false);
        }
        callback(null, true);
    },
    handlePreflightRequest: (req, res) => {
        const headers = {
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Origin': req.headers.origin,
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': 1728000,
        };

        res.writeHead(200, headers);
        res.end();
    },
    path: '/chat',
    serveClient: false,
});

// app.get('/', (req, res) => {
//     return res.status(200).json({ message: 'Hello' });
// });

// io.use((socket, next) => {
//     const authToken = socket.request.headers['authorization'];
    
//     if (authToken) return next();
    
//     next(new Error('invalid token, try again'));
// });

io.use(authSocketIo);

io.on('connection', (socket) => {
    socket.emit('message', { message: 'Hello' });
    socket.on('auth', (data) => {
        console.log(data);
    });
});

server.listen(3001);







// const server = require('http').createServer(app);


// const io = require('socket.io').listen(server, {
//     origins: '*:*',
//     transports: ['websocket', 'htmlfile', 'xhr-polling', 'jsonp-polling', 'polling'],
// });

// io.on('connection', socket => {
//     console.log(socket.handshake.headers);

//     // socket.on('authentication', (data) => {
//     //     console.log(data);

//     //     socket.broadcast.emit('receivedMessage', []);
//     // });
// });

//const routes = require('./routes');

// mongoose.connect('mongodb://localhost/chat', { 
//     useNewUrlParser: true, 
//     useUnifiedTopology: true,
//     useCreateIndex: true,
// })
// .catch (() => console.log('Database connection failed'));

//app.use(express.json());
//app.use('/api', routes);

// io.use((socket, next) => {
//     const request = socket;

//     console.log(request);

//     if (!request) {
//         next(new Error('not authorized'));
//     }
//     else {
//         next();
//     }
// })

// const messages = [];

// io.on('connection', async socket => {
//     console.log(socket.handshake);
    
//     console.log(`Socket conectado: ${ socket.id }`);

//     // Evento para enviar todas as mensagens já salvas no banco.
//     socket.emit('previousMessages', messages);

//     // Evento que recebe as mensagens vindas do usuário.
//     socket.on('sendMessage', async data => {
//         const message = { text: data.message };

//         // Insere a mensagem enviada no array de mensagens.
//         messages.push(message);

//         // Transmite a mensagem para todas as conexões ativas.
//         socket.broadcast.emit('receivedMessage', message);
//     });
// });

//server.listen(3001);
