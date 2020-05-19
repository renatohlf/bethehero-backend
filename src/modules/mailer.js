const path = require('path');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

var transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  transport.use('compile', hbs({
    viewEngine: {
      extName: '.hbs',
      partialsDir: './src/resources/mail/',
      layoutsDir: './src/resources/mail/',
      defaultLayout: '',
    },
    viewPath: path.resolve('./src/resources/mail/'),
    extName: '.html'
  }));

  module.exports = transport;