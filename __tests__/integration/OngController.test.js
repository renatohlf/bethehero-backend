const Ong = require('../../src/app/models/ong');
const User = require('../../src/app/models/user');
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

describe('Test OngController', () => {

    it('should list ongs', async () => {
        await request.post('/register').send({
            "ongName": "TEST1",
            "email":"contato1@test1.com",
            "whatsapp": "",
            "city": "Recife",
            "uf": "PE",
            "password": "12345"
        });

        await request.post('/register').send({
            "ongName": "TEST2",
            "email":"contato2@test2.com",
            "whatsapp": "",
            "city": "Recife",
            "uf": "PE",
            "password": "123456"
        });

        
        const response = await request.get('/ongs');
    
        expect(response.body).toHaveLength(2);
        expect(response.status).toBe(200);
    });    
});


