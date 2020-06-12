const Message = require('../models/Message');

module.exports = {
    async send(req, res) {
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
