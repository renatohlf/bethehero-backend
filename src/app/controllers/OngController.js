import Ong from '../models/ong.js';

async function listOngs(request, response) {
    const ongs = await Ong.find();
    return response.send(ongs);
}

async function getOng(request, response) {
    const userId = request.userId;

    await Ong.findOne({ user: userId })
    .then((ong) => {
        return response.send({ name: ong.name, whatsapp: ong.whatsapp, city: ong.city, uf: ong.uf });
    })
    .catch(err => {
        return response.status(400).send({ error: err }); 
    });
    
}

export default { listOngs, getOng };