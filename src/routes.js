import express from 'express';

import OngController from './app/controllers/OngController.js';
import IncidentsController from './app/controllers/IncidentController.js';
import ProfileController from './app/controllers/ProfileController.js';
import AuthController from './app/controllers/AuthController.js';
import authenticated from './app/middlewares/authMiddleware.js';

const routes = express.Router();

// Routes
routes.post('/api/login', AuthController.login);
routes.post('/api/signup', AuthController.register);
routes.post('/api/password/lost', AuthController.lostPassword);
routes.post('/api/password/reset', AuthController.resetPassword);

routes.get('/api/ongs', OngController.listOngs);
routes.get('/api/ong', authenticated, OngController.getOng);

routes.get('/api/profile', authenticated, ProfileController.ongIncidents);
routes.patch('/api/profile/edit', authenticated, ProfileController.editProfile);

routes.get('/api/incidents', IncidentsController.listIncidents);
routes.post('/api/incidents', authenticated, IncidentsController.create);
routes.delete('/api/incidents/:id',authenticated,IncidentsController.deleteIncident);

export default routes;