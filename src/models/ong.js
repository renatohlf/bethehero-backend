const mongoose = require('../database/index');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const OngSchema = new mongoose.Schema({
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
        required: true,
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