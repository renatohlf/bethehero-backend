const Incident = require('../models/incident');
const Ong = require('../models/ong');

module.exports = {
    async ongIncidents(request, response) {
        const { page = 1 } = request.query;
        const limit = 6;
        const userId = request.userId;

        const ong = await Ong.findOne({ user: userId });

        const incidents = await Incident.find({ ong: ong.id })
            .skip((page - 1) * limit)
            .limit(limit);

        const count = await Incident.find({ ong: ong.id }).countDocuments();

        return response.json({
            total: count,
            limit: limit,
            results: incidents
        });
    }
};