import Ong from '../../src/app/models/ong.js';
import User from '../../src/app/models/user.js';
import supertest from 'supertest';
import app from '../../src/server.js';
const request = supertest(app);
import { setupDB } from '../test-setup.js';

setupDB();

describe('Sign in', () => {
    it('Should register an user', async () => {
        const response = await request.post('/register').send({
            "ongName": "TEST",
            "email":"contato@test.com",
            "whatsapp": "",
            "city": "Recife",
            "uf": "PE",
            "password": "12345"
        });

        const user = await User.findOne({ email: 'contato@test.com' }).select('+password');
        const ong = await Ong.findOne({ user: user.id });

        expect(ong.name).toBe('TEST');
        expect(user.password).not.toBe('12345');
        expect(response.status).toBe(200);
    });

    it('Should Login', async () => {
        await request.post('/register').send({
            "ongName": "TEST",
            "email":"contato@test.com",
            "whatsapp": "",
            "city": "Recife",
            "uf": "PE",
            "password": "12345"
        });

        const response = await request.post('/login').send({
            "email":"contato@test.com",
            "password": "12345"
        });

        expect(response.status).toBe(200);
    });

    it('Should not login and return invalid password', async () => {
        await request.post('/register').send({
            "ongName": "TEST",
            "email":"contato@test.com",
            "whatsapp": "",
            "city": "Recife",
            "uf": "PE",
            "password": "12345"
        });

        const response = await request.post('/login').send({
            "email":"contato@test.com",
            "password": "123456"
        });
        
        expect(response.body.error).toBe('Invalid password');
        expect(response.status).toBe(400);
    });

    it('Should not login and return user not found', async () => {
        await request.post('/register').send({
            "ongName": "TEST",
            "email":"contato@test.com",
            "whatsapp": "",
            "city": "Recife",
            "uf": "PE",
            "password": "12345"
        });

        const response = await request.post('/login').send({
            "email":"contato2@test2.com",
            "password": "12345"
        });
        
        expect(response.body.error).toBe('User not found');
        expect(response.status).toBe(400);
    });

    it('Should send an email for "Lost password"', async () => {
        await request.post('/register').send({
            "ongName": "TEST",
            "email":"contato@test.com",
            "whatsapp": "",
            "city": "Recife",
            "uf": "PE",
            "password": "12345"
        });

        const response = await request.post('/lost_password').send({
            "email":"contato@test.com",
        });
        
        expect(response.status).toBe(200);
    });

})