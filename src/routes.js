import express from 'express';

import OngController from './app/controllers/OngController.js';
import IncidentsController from './app/controllers/IncidentController.js';
import ProfileController from './app/controllers/ProfileController.js';
import AuthController from './app/controllers/AuthController.js';
import authenticated from './app/middlewares/authMiddleware.js';

const routes = express.Router();

// Routes
routes.post('/login', AuthController.login);
routes.post('/signup', AuthController.register);
routes.post('/password/lost', AuthController.lostPassword);
routes.post('/password/reset', AuthController.resetPassword);

routes.get('/ongs', OngController.listOngs);
routes.get('/ong', authenticated, OngController.getOng);

routes.get('/profile', authenticated, ProfileController.ongIncidents);
routes.patch('/profile/edit', authenticated, ProfileController.editProfile);

routes.get('/incidents', IncidentsController.listIncidents);
routes.post('/incidents', authenticated, IncidentsController.create);
routes.delete('/incidents/:id',authenticated,IncidentsController.deleteIncident);

export default routes;