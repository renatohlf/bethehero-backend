const Ong = require('../../src/app/models/ong');
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
    Check auth.test.js to see how it works, or check it out in the documentation of mockingoose
 */

describe('Test OngController', () => {
    it('Should register an ONG', async () => {
        const response = await request.post('/register').send({
            "name": "TEST",
            "email":"contato@test.com",
            "whatsapp": "",
            "city": "Recife",
            "uf": "PE",
            "password": "12345"
        });

        const ong = await Ong.findOne({ email: 'contato@test.com' }).select('+password');

        expect(ong.password).not.toBe('12345');
        expect(response.status).toBe(200);
    });

    it('should list ongs', async () => {
        await request.post('/register').send({
            "name": "TEST",
            "email":"contato@test.com",
            "whatsapp": "",
            "city": "Recife",
            "uf": "PE",
            "password": "12345"
        });

        await request.post('/register').send({
            "name": "TEST2",
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


