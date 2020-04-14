const connection = require('../database/connection');
const crypto = require('crypto');

module.exports = { 
    async listIncidents(request, response) {
        const { page = 1 } = request.query;
        const limit = 5;
        const [count] = await connection('incidents').count();
        
        const incidents = await connection('incidents')
        .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
        .limit(limit)
        .offset((page - 1) * limit)
        .select([
            'incidents.*', 
            'ongs.name', 
            'ongs.email', 
            'ongs.whatsapp', 
            'ongs.city', 
            'ongs.uf'
        ]);
        
        return response.json({
            total: count['count(*)'],
            limit: 5,
            results: incidents
        });
    },
    async create(request, response) {
        const { title, description, value } = request.body;
        const ong_id = request.headers.authorization;

        const [id] = await connection('incidents').insert({ 
            ong_id,
            title, 
            description, 
            value
        });

        return response.json({ id });
    },
    async delete(request, response) {
        const { id } = request.params;
        const ong_id = request.headers.authorization;
    
        const incident = await connection('incidents')
        .where('id', id)
        .select('ong_id')
        .first();

        if(!incident) {
            return response.status(404).json({ error: 'Incident not found' });
        }

        if(incident.ong_id !== ong_id) {
            return response.status(401).json({ error: 'Operation not authorized' });
        }

        await connection('incidents').where('id', id).delete();

        return response.status(204).send();
    },
}