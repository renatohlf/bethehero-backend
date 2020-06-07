import dotenv from 'dotenv';

dotenv.config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});
import express from 'express';
import routes from './routes.js';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();

app.use(cors({
    // origin: 'http://myapp.com'
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(routes);

export default app;