const Ong = require('../models/ong');

module.exports = {
    async listOngs(request, response) {
        const ongs = await Ong.find();
        return response.json(ongs);
    }
};