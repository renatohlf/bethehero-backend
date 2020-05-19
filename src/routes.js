const express = require('express');

const OngController = require('./app/controllers/OngController');
const IncidentsController = require('./app/controllers/IncidentController');
const ProfileController = require('./app/controllers/ProfileController');
const AuthController = require('./app/controllers/AuthController');
const authenticated = require('./app/middlewares/authMiddleware');

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

module.exports = routes;