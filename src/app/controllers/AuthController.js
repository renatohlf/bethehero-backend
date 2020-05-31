const Ong = require('../models/ong');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sendMail, generateToken } = require('../helpers/utils');
const mongoose = require('mongoose');

module.exports = { 
    async register(request, response) {
        const { firstName, lastName, ongName, email, whatsapp, password, city, uf } = request.body;    
        const session = await mongoose.startSession();

        if(await User.findOne({ email })) {
            return response.status(400).json({ error: 'User already exists'});
        }
        await session.startTransaction();
        try {
           
            const user = await User.create([{
                firstName,
                lastName,
                email,
                phone: whatsapp,
                password 
            }], session);
    
            user[0].password = undefined;

          
            await Ong.create([{ 
                name: ongName, 
                user: user[0].id,
                whatsapp, 
                city, 
                uf
            }], session);
           

            sendMail({
                to: email,
                template: 'auth/confirm_registration',
                subject: 'Confirm Registration',
                context: { ongName, email }
            }).then(async () => {
               
                await session.commitTransaction();
                session.endSession();
                return response.send();
            }).catch(async (err) => {
                await session.abortTransaction();
                session.endSession();
                return response.status(400).send({ error: 'Error sending email, try again later...'});
            });
           
        } catch(err) {
            await session.abortTransaction();
            session.endSession();
            return response.status(400).json({ error: 'Registration Failed'});
        }
        
   },
   async login(req, res) {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if(!user) {
            return res.status(400).json({ error: 'User not found'});  
        }

        if(!await bcrypt.compare(password, user.password)){
            return res.status(400).json({ error: 'Invalid password'}); 
        }

        user.password = undefined;

        const token = generateToken({ id: user.id });

        const ong = await Ong.findOne({ user: user.id });

        return res.send({ userId: user.id, ong, token });
    },
    async lostPassword(req, res) {
        const { email } = req.body;

        try {
            const user =  await User.findOne({ email });

            if(!user) {
                res.status(400).send({ error: 'User not found' });    
            }
            const token = crypto.randomBytes(20).toString('hex');

            const now = new Date();
            now.setHours(now.getHours() + 1);

            await User.findByIdAndUpdate(user.id, {
                '$set': {
                    passwordResetToken: token,
                    passwordResetExpires: now
                }
            });

            sendMail({
                to: email,
                template: 'auth/lost_password',
                subject: 'Password recovery',
                context: { email, token }
            }).then(() => {
                return res.send();
            }).catch(err => {
                return res.status(400).send({ error: 'Error sending email, try again later...'});
            }); 

        } catch(err) {
            res.status(400).send({ error: 'Error on lost password, try again' })    
        }
    },
    async resetPassword(req,  res) {
        const { email, token, password } = req.body;

        try {
            const user = await User.findOne({ email }).select('+passwordResetToken passwordResetExpires name');
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
                subject: 'Password updated',
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