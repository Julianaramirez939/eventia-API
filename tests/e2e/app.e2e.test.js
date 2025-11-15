const request = require('supertest');
const app = require('../../src/app');

describe('E2E - API completa', () => {

  test('Listar eventos retorna 200', async () => {
    const res = await request(app).get('/events');
    expect(res.status).toBe(200);
  });

});
