const Ong = require('../models/ong');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');
const { sendMail } = require('../helpers/utils');


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

            sendMail({
                to: email,
                template: 'auth/confirm_registration',
                context: { name, email }
            }).then(() => {
                return response.send();
            }).catch(err => {
                return response.status(400).send({ error: 'Error sending email, try again later...'});
            });

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

        return res.send({ ong, token });
    },
    async lostPassword(req, res) {
        const { email } = req.body;

        try {
            const user =  await Ong.findOne({ email });

            if(!user) {
                res.status(400).send({ error: 'User/Ong not found' });    
            }
            const token = crypto.randomBytes(20).toString('hex');

            const now = new Date();
            now.setHours(now.getHours() + 1);

            await Ong.findByIdAndUpdate(user.id, {
                '$set': {
                    passwordResetToken: token,
                    passwordResetExpires: now
                }
              });

            sendMail({
                to: email,
                template: 'auth/lost_password',
                context: { email, token }
            }).then(() => {
                return res.send();
            }).catch(err => {
                return res.status(400).send({ error: 'Error sending email, try again later...'});
            }); 

        } catch(err) {
            res.status(400).send({ error: 'Error on lost password, try again', trace: err })    
        }
    },
    async resetPassword(req,  res) {
        const { email, token, password } = req.body;

        try {
            const user = await Ong.findOne({ email }).select('+passwordResetToken passwordResetExpires name');
            const now = new Date();

            if(!user)
                return res.status(400).send({ error: 'User not found' });    

            if(token !== user.passwordResetToken)
                return res.status(400).send({ error: 'Invalid Token' });
            
            if(now > user.passwordResetExpires)
                return res.status(400).send({ error: 'Token Expired' });

            user.password = password;

            await user.save();
           
            sendMail({
                to: email,
                template: 'auth/password_updated',
                context: { username: user.name }
            }).then(() => {
                return res.send();
            }).catch(err => {
                return res.status(400).send({ error: 'Error sending email, try again later...'});
            }); 
        

        } catch(err) {
            return res.status(400).send({ error: 'Error on reseting password' });
        }
    }
};