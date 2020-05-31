const mailer = require('../../modules/mailer');
const jwt = require('jsonwebtoken');

function sendMail({to, template, subject, context}){
    mailer.sendMail({
        from: 'noreply@bethehero.com',
        to,
        subject,
        template,
        context
    }, err => {
        if(err) {
            return Promise.reject({ error: 'Error sending email, try again later...'});
        }
        return Promise.resolve();
    });
    return Promise.resolve();
}

function generateToken(params = {}) {
    return jwt.sign(params, process.env.SECRET, { expiresIn: 86400 });
}

module.exports = { sendMail, generateToken }