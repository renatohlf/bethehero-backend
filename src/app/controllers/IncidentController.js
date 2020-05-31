const Incident = require('../models/incident');
const Ong = require('../models/ong');

module.exports = { 
    async listIncidents(request, response) {
        const { page = 1 } = request.query;
        const limit = 2;

    
        const count = await Incident.find().countDocuments();

        const incidents = await Incident.find()
            .populate('ong')
            .skip((page - 1) * limit)
            .limit(limit);
        
        return response.json({
            total: count,
            limit: limit,
            results: incidents
        });
    },
    async create(request, response) {
        const { title, description, value } = request.body;
        const userId = request.userId;
        
        try {
            const ong = await Ong.findOne({ user: userId });

            const incident = await Incident.create({ 
                ong: ong.id,
                title, 
                description, 
                value
            });
            return response.json({ incident });
        } catch(err){
            return response.status(400).json({ error: 'Operation not possible' });
        }
        
        
    },
    async delete(request, response) {
        const { id } = request.params;
        const userId = request.userId;

        const ong = await Ong.findOne({ user: userId });

        const incident = await Incident.findById({ _id: id }).populate('ong_id');
        
        if(!incident) {
            return response.status(404).json({ error: 'Incident not found' });
        }

        if(incident.ong.toString() !== ong.id) {
            return response.status(401).json({ error: 'Operation not authorized' });
        }

        await Incident.deleteOne({ _id: id })

        return response.status(204).send();
    },
}