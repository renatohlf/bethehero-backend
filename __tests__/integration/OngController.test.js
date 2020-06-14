import supertest from 'supertest';
import app from '../../src/server.js';
const request = supertest(app);
import { setupDB } from '../test-setup.js';
setupDB();

describe('Test OngController', () => {

    it('should list ongs', async () => {
        await request.post('/signup').send({
            "ongName": "TEST55",
            "email":"contato1@ssss.com",
            "whatsapp": "",
            "city": "Recife",
            "uf": "PE",
            "password": "13332"
        }).expect(200)
        .then(async (res) => {
           return await request.post('/signup').send({
                "ongName": "TEST2",
                "email":"contato2@test2.com",
                "whatsapp": "",
                "city": "Recife",
                "uf": "PE",
                "password": "123456"
            }).expect(200);
        }).then(async ()=> {
            const response = await request.get('/ongs');
            expect(response.body).toHaveLength(2);
            expect(response.status).toBe(200);
        });

        
    });    
});


