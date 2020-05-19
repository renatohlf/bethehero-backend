const mongoose = require('../../database/index');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const OngSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true       
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    whatsapp: {
        type: String,
    },
    city: {
        type: String,
        required: true,
    },
    uf: {
        type: String,
        required: true,
        uppercase: true,
        maxlength: 2,
    },
    passwordResetToken: {
        type: String,
        select: false
    },
    passwordResetExpires: {
        type: Date,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
    
});

OngSchema.pre('save', async function(next) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    next();
});

const Ong = mongoose.model('ong', OngSchema);

module.exports = Ong;