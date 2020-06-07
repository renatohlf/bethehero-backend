import Incident from '../models/incident.js';
import Ong from '../models/ong.js';

async function editProfile(request, response) {
    const userId = request.userId;

    await Ong.findOneAndUpdate({ user: userId }, request.body , { new: true })
    .then((ong) => {
        return response.send(ong);
    })
    .catch(err => {
        return response.status(400).send({ error: 'An error occured on edit profile'});
    });
}

async function ongIncidents(request, response) {
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

export default { ongIncidents, editProfile };