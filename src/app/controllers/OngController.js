import Ong from '../models/ong.js';

export default {
    async listOngs(request, response) {
        const ongs = await Ong.find();
        return response.send(ongs);
    }
};