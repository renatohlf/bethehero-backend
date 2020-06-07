import Ong from '../../src/app/models/ong.js';
import User from '../../src/app/models/user.js';
import Incident from '../../src/app/models/incident.js';
import { generateToken } from '../../src/app/helpers/utils.js';
import supertest from 'supertest';
import app from '../../src/server.js';
const request = supertest(app);
import { setupDB } from '../test-setup.js';

setupDB();

describe('Test incidentController', () => {

    it('Should create an incident', async () => {
        const user = { 
            firstName: 'Test',
            lastName: 'User',
            email: 'test@test.com',
            whatsapp: '',
            password: '12345'
        };

        const createdUser = await User.create(user);        

        const ong = { 
            name: 'TEST_ONG', 
            whatsapp: '', 
            city: 'Recife', 
            uf: 'PE',
            user: createdUser.id
        };

        const createdOng = await Ong.create(ong);   
        const token = generateToken({ id: createdUser.id });

        const response = await request.post('/incidents').send({
            "title": "Test Incident",
            "description": "test description",
            "value": "123",
            "ong": createdOng.id
        }).set('Authorization', token);

        expect(response.status).toBe(200);

        const incident = await Incident.findOne({ _id: response.body.incident._id });

        expect(incident.ong).not.toBe('');
    });



    it('Should list incidents', async () => {
        const user = { 
            firstName: 'Test',
            lastName: 'User',
            email: 'test@test.com',
            whatsapp: '',
            password: '12345'
        };

        const createdUser = await User.create(user);        

        const ong = { 
            name: 'TEST_ONG', 
            whatsapp: '', 
            city: 'Recife', 
            uf: 'PE',
            user: createdUser.id
        };

        const createdOng = await Ong.create(ong);   
        const token = generateToken({ id: createdUser.id });
    
        await request.post('/incidents').send({
            "title": "Test Incident",
            "description": "test description",
            "value": "123",
            "ong": createdOng.id
        }).set('Authorization', token);

        await request.post('/incidents').send({
            "title": "Test Incident2",
            "description": "test description2",
            "value": "1234",
            "ong": createdOng.id
        }).set('Authorization', token);

        const response = await request.get('/incidents');

        expect(response.status).toBe(200);
        expect(response.body.results).toHaveLength(2);
        
    });

  

    it('Should delete an incident', async () => {

        const user = { 
            firstName: 'Test',
            lastName: 'User',
            email: 'test@test.com',
            whatsapp: '',
            password: '12345'
        };

        const createdUser = await User.create(user);        

        const ong = { 
            name: 'TEST_ONG', 
            whatsapp: '', 
            city: 'Recife', 
            uf: 'PE',
            user: createdUser.id
        };

        const createdOng = await Ong.create(ong);   
        const token = generateToken({ id: createdUser.id });
        
        const incidentsResponse = await request.post('/incidents').send({
            "title": "Test Incident",
            "description": "test description",
            "value": "123",
            "ong": createdOng.id
        }).set('Authorization', token);

        const incident = await Incident.findOne({ _id: incidentsResponse.body.incident._id });

        const response = await request.delete('/incidents/'+incident.id).set('Authorization', token);
        
        expect(response.status).toBe(204);
    });

});