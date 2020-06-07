import express from 'express';

import OngController from './app/controllers/OngController.js';
import IncidentsController from './app/controllers/IncidentController.js';
import ProfileController from './app/controllers/ProfileController.js';
import AuthController from './app/controllers/AuthController.js';
import authenticated from './app/middlewares/authMiddleware.js';

const routes = express.Router();

// Routes
routes.post('/login', AuthController.login);
routes.post('/register', AuthController.register);
routes.post('/lost_password', AuthController.lostPassword);
routes.post('/reset_password', AuthController.resetPassword);

routes.get('/ongs', OngController.listOngs);
//routes.post('/ongs', OngController.create);

routes.get('/profile', authenticated, ProfileController.ongIncidents);

routes.get('/incidents', IncidentsController.listIncidents);
routes.post('/incidents', authenticated, IncidentsController.create);
routes.delete('/incidents/:id',authenticated,IncidentsController.delete);

export default routes;