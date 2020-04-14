const connection = require('../database/connection');

module.exports = {
    async profile(request, response) {
        const { page = 1 } = request.query;
        const limit = 6;
        const ong_id = request.headers.authorization;
        
        const incidents = await connection('incidents')
        .where('ong_id', ong_id)
        .limit(limit)
        .offset((page - 1) * limit)
        .select('*');

        const [count] = await connection('incidents')
        .where('ong_id', ong_id).count();

        return response.json({
            total: count['count(*)'],
            limit: limit,
            results: incidents
        });
    }
};