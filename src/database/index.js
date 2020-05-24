//We need to import it here because when we are running tests, the index.js from root doesn't run from the test runner
const dotenv = require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

const mongoose = require('mongoose');

mongoose.connect(process.env.APP_DB, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true 
});
mongoose.Promise = global.Promise;


module.exports = mongoose;