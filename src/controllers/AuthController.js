const Ong = require('../models/ong');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');


function generateToken(params = {}) {
    return jwt.sign(params, process.env.SECRET, { expiresIn: 86400 });
}
module.exports = { 
    async register(request, response){
        const { name, email, whatsapp, password, city, uf } = request.body;

        try {
            if(await Ong.findOne({ email })) {
                return response.status(400).json({ error: 'Ong already exists'});
            }
           const ong = await Ong.create({ 
                name, 
                email, 
                password,
                whatsapp, 
                city, 
                uf
            });
            ong.password = undefined;

            const token = generateToken({ id: ong.id });
        
            return response.json({ ong , token });

        } catch(err) {
            return response.status(400).json({ error: 'Registration Failed'});
        }
        
   },
   async login(req, res) {
        const { email, password } = req.body;

        const ong = await Ong.findOne({email}).select('+password');

        if(!ong) {
            return res.status(400).json({ error: 'Ong not found'});  
        }

        if(!await bcrypt.compare(password, ong.password)){
            return res.status(400).json({ error: 'Invalid password'}); 
        }

        ong.password = undefined;

        const token = generateToken({ id: ong.id });

        return res.send({ong, token});
    }
};