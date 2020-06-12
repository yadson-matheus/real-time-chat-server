const Message = require('../models/Message');

module.exports = {
    async connect(socket) {
        console.log(`Socket conectado: ${ socket.id }`);

        // Histórico de mensagens.
        const messages = await Message.find();

        // Evento para enviar o histórico de mensagens ao abrir o chat.
        socket.emit('messageHistory', messages);

        // Evento que recebe as mensagens vindas do usuário.
        socket.on('sendMessage', async message => {
            const { text } = message;

            if (!text) 
                next(new Error('text field is required'));

            Message.create({ text, user }, function (err, message) {
                if (err) 
                    return res.status(400).json({ error: 'cannot send message' });
    
                return res.status(200).json({ message });
            });

            // Insere a mensagem enviada no array de mensagens.
            const message = await setMessage(data.message);

            // Transmite a mensagem para todas as conexões ativas.
            socket.broadcast.emit('receivedMessage', message);
        });

        
        const { userId: user } = req;
        const { text } = req.body;

        if (!text) 
            return res.status(400).json({ error: 'text field is required' });

        Message.create({ text, user }, function (err, message) {
            if (err) 
                return res.status(400).json({ error: 'cannot send message' });

            return res.status(200).json({ message });
        });
    },
};
