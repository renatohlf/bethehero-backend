const Incident = require('../models/incident');

module.exports = {
    async ongIncidents(request, response) {
        const { page = 1 } = request.query;
        const limit = 6;
        const ong_id = request.userId;

        const incidents = await Incident.find({ ong: ong_id })
            .skip((page - 1) * limit)
            .limit(limit);

        const count = await Incident.find({ ong: ong_id }).countDocuments();

        return response.json({
            total: count,
            limit: limit,
            results: incidents
        });
    }
};