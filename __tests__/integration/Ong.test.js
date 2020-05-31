const mockingoose = require('mockingoose').default;
const Ong = require('../../src/app/models/ong');
const User = require('../../src/app/models/user');

describe('Ong test', () => {
    it('Should create an ONG', async () => {
        const user = { 
            firstName: 'Test',
            lastName: 'User',
            email: 'test@test.com',
            whatsapp: '',
            password: '12345'
        };

        mockingoose(User).toReturn('save');

        const createdUser = await User.create(user);        

        const ong = { 
            name: 'TEST_ONG', 
            whatsapp: '', 
            city: 'Recife', 
            uf: 'PE',
            user: createdUser.id
        };

        mockingoose(Ong).toReturn('save');

        const createdOng = await Ong.create(ong);        

        expect(createdUser.firstName).toBe('Test');
        expect(createdUser.email).toBe('test@test.com');
        expect(createdUser.password).not.toBe('12345'); //it must be a hashed password

        expect(createdOng.name).toBe('TEST_ONG');
        expect(createdOng.city).toBe('Recife');
        expect(createdOng.uf).toHaveLength(2);
        expect(createdOng.user).not.toBeNull();
        expect(createdOng.user.toString()).toBe(createdUser.id);
    });

    
})