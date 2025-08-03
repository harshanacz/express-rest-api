import request from 'supertest';
import app from '../server.js';

describe('GET /', () => {
  it('should return welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Welcome to the Client Management System API!');
  });
});