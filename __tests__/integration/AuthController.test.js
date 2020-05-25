const mockingoose = require('mockingoose').default;
const Ong = require('../../src/app/models/ong');

describe('Sign in', () => {
    it('Should create an ONG', async () => {
        const ong = { 
            name: 'TEST_ONG', 
            email: 'test@ong.com', 
            password: '12345',
            whatsapp: '', 
            city: 'Recife', 
            uf: 'PE'
        };

        mockingoose(Ong).toReturn('save');

        const createdOng = await Ong.create(ong);        

        expect(createdOng.name).toBe('TEST_ONG');
        expect(createdOng.email).toBe('test@ong.com');
        expect(createdOng.password).not.toBe('12345'); //it must be a hashed password
        expect(createdOng.uf).toHaveLength(2);
    });

    
})