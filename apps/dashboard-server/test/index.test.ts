// eslint-disable-next-line node/no-unpublished-import
import supertest from 'supertest';
import expressLoader from '../src/loaders/express';

const app = expressLoader();

describe('Hello World', () => {
  it('Returns Hello World', async () => {
    await supertest(app).get('/hello').expect('Hello World!');
  });
});

describe('Log In', () => {
  it('an existing user', async () => {
    await supertest(app)
      .post('/auth/login')
      .send({
        email: 'himanshu.kapur17@gmail.com',
        password: '123456'
      })
      .expect(200)
      .then((response) => {
        expect(response.body.name).toBe('himanshu');
        expect(response.body.email).toBe('himanshu.kapur17@gmail.com');
      });
  });
});
