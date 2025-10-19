const request = require('supertest');
const app = require('../../src/app');
const { sequelize } = require('../../src/models');

beforeAll(async () => { await sequelize.sync({ force: true }); await request(app).post('/api/events/initialize').auth('admin', process.env.ADMIN_TOKEN || 'password123').send({ title: 'V1', venue: 'V', date: new Date(), totalTickets: 1 }); });
afterAll(async () => { await sequelize.close(); });

test('book returns 400 for missing payload', async () => {
  const res = await request(app).post('/api/events/book').send({});
  expect(res.status).toBe(400);
});
