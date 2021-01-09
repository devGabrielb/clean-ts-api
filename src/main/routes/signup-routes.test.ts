import request from 'supertest';
import app from '../config/app';
describe('Signup Routes Middleware', () => {
  test('should return an account on success ', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Gabriel Batista',
        email: 'gabb8091@gmail.com',
        password: '123',
        confirmpassword: '123',
      })
      .expect(200);
  });
});
