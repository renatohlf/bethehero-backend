const express = require('express');

const OngController = require('./controllers/OngController');
const IncidentsController = require('./controllers/IncidentController');
const ProfileController = require('./controllers/ProfileController');
const AuthController = require('./controllers/AuthController');
const authenticated = require('./middlewares/authMiddleware');

const routes = express.Router();

// Routes
routes.post('/login', AuthController.login);
routes.post('/register', AuthController.register);

routes.get('/ongs', OngController.listOngs);
//routes.post('/ongs', OngController.create);

routes.get('/profile', authenticated, ProfileController.ongIncidents);

routes.get('/incidents', IncidentsController.listIncidents);
routes.post('/incidents', authenticated, IncidentsController.create);
routes.delete('/incidents/:id',authenticated,IncidentsController.delete);


module.exports = routes;