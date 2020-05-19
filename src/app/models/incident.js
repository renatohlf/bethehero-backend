const mongoose = require('../../database/index');

const Schema = mongoose.Schema;

const IncidentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String   
    },
    value: {
        type: Number,
        required: true
    },
    ong: {
        type: Schema.Types.ObjectId,
        ref: 'ong',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
    
});

const Incident = mongoose.model('incident', IncidentSchema);

module.exports = Incident;