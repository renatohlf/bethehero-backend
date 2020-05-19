const mailer = require('../../modules/mailer');

function sendMail({to, template, context}){
    mailer.sendMail({
        from: 'noreply@bethehero.com',
        to,
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

module.exports = { sendMail }