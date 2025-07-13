const request = require('supertest');
const app = require('../src/index');

describe('Express App', () => {
  it('should return 404 for the root path', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('success', false);
  });

  it('should serve Swagger UI at /api-docs/', async () => {
    const res = await request(app).get('/api-docs/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toMatch(/Swagger UI/);
  });

  it('should return a success response at /api/', async () => {
    const res = await request(app).get('/api/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
  });
});
