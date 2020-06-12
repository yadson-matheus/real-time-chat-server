const User = require('../models/User');

module.exports = {
    async add(req, res) {
        const { email, password } = req.body;

        if (!email) 
            return res.status(400).json({ error: 'please provide an email' });

        if (!password) 
            return res.status(400).json({ error: 'password field is required' });

        if (await User.findOne({ email })) 
            return res.status(400).json({ error: 'user already exists' });
        
        User.create({ email, password }, function (err, user) {
            if (err) 
                return res.status(400).json({ error: 'registration failed' });

            user.password = undefined;

            const token = user.generateToken();
                    
            return res.status(200).json({ user, token });
        });
    },
    async authenticate(req, res) {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ error: 'user or password not found' });

        const user = await User.findOne({ email }).select('+password');

        if (!user) 
            return res.status(400).json({ error: 'user not found' });

        if (!await user.compareHash(password))
            return res.status(400).json({ error: 'invalid password' });

        user.password = undefined;

        const token = user.generateToken();

        return res.status(200).json({ user, token });
    },
};