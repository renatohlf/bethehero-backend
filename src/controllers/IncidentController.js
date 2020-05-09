const Incident = require('../models/incident');

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
        const ong_id = request.userId;
        
        try {
            const incident = await Incident.create({ 
                ong: ong_id,
                title, 
                description, 
                value
            });
            return response.json({ incident });
        } catch(err){
            console.log(err);
            return response.status(400).json({ error: 'Operation not possible' });
        }
        
        
    },
    async delete(request, response) {
        const { id } = request.params;
        const ong_id = request.userId;

        const incident = await Incident.findById({ _id: id }).populate('ong_id');
        
        if(!incident) {
            return response.status(404).json({ error: 'Incident not found' });
        }

        if(incident.ong.toString() !== ong_id) {
            return response.status(401).json({ error: 'Operation not authorized' });
        }

        await Incident.deleteOne({ _id: id })

        return response.status(204).send();
    },
}