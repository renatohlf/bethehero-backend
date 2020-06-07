// //We need to import it here because when we are running tests, the index.js from root doesn't run from the test runner
import dotenv from 'dotenv';

dotenv.config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

import mongoose from 'mongoose';

// It's just so easy to connect to the MongoDB Memory Server (global.__MONGO_URI__)
mongoose.connect(process.env.NODE_ENV === 'test' ? global.__MONGO_URI__ : process.env.APP_DB, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});
mongoose.Promise = global.Promise;

export default mongoose;