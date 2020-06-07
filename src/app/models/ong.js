import mongoose from '../../database/index.js';

const Schema = mongoose.Schema;

const OngSchema = new Schema({
    name: {
        type: String,
        required: true,
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
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
    
});


const Ong = mongoose.model('ong', OngSchema);

export default Ong;