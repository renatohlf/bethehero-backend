const mongoose = require('mongoose');

mongoose.connect(process.env.APP_DB, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true 
});
mongoose.Promise = global.Promise;


module.exports = mongoose;