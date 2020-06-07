import mailer from '../../modules/mailer.js';
import jwt from 'jsonwebtoken';

export function sendMail({to, template, subject, context}){
    mailer.sendMail({
        from: 'noreply@bethehero.com',
        to,
        subject,
        template,
        context
    }, err => {
        if(err) {
            return Promise.reject(err);
        }
        return Promise.resolve();
    });
    return Promise.resolve();
}

export function generateToken(params = {}) {
    return jwt.sign(params, process.env.SECRET, { expiresIn: 86400 });
}