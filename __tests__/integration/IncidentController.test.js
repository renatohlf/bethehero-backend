const Ong = require('../../src/app/models/ong');
const User = require('../../src/app/models/user');
const Incident = require('../../src/app/models/incident');
const { generateToken } = require('../../src/app/helpers/utils');
const supertest = require('supertest');
const app = require('../../src/server');
const request = supertest(app);
const { setupDB } = require('../test-setup');

setupDB('bethehero-test');

/*  In this test suit, we are using real data to test the endpoints.
    Note that there is not imports for "mockingoose" 
    If you need to test endpoints with mocked data, then import mockingoose.
    const mockingoose = require('mockingoose').default;
    Check it out in the documentation of mockingoose
 */

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

        
        const incident = await Incident.findOne({ _id: response.body.incident._id });
    
        expect(response.status).toBe(200);
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