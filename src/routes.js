const express = require('express');

const OngController = require('./controllers/OngController');
const IncidentsController = require('./controllers/IncidentController');
const ProfileController = require('./controllers/ProfileController');
const SessionController = require('./controllers/SessionController');

const routes = express.Router();

// Routes
routes.post('/login', SessionController.login);

routes.get('/ongs', OngController.listOngs);
routes.post('/ongs', OngController.create);

routes.get('/profile', ProfileController.profile);

routes.get('/incidents', IncidentsController.listIncidents);
routes.post('/incidents', IncidentsController.create);
routes.delete('/incidents/:id', IncidentsController.delete);


module.exports = routes;