const mongoose = require('mongoose');
const uniqueValidation = require('mongoose-unique-validation');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: 'E-mail must be unique',
        required: [true, 'E-mail is required'],
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    modifiedAt: {
		type: Date, 
        default: Date.now,
	},
});

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) next();
  
    this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.pre('update', async function(next) {
    if (!this.isModified()) next();
    
    await this.update({}, { $set: { modifiedAt: new Date() } });
});
  
UserSchema.methods = {
    async compareHash(hash) {
        return await bcrypt.compare(hash, this.password);
    },
    generateToken() {
        return jwt.sign({ id: this.id }, 'secret', { expiresIn: 86400 });
    },
};

UserSchema.plugin(uniqueValidation);

module.exports = mongoose.model('User', UserSchema);
