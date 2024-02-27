import app from '../app';
import supertest from 'supertest';

const request = supertest(app);

console.log('testing');

describe('GET /', () => {
  it('should return "Hello, World!"', async () => {
    const response = await request.get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello, World!');
  });
});
