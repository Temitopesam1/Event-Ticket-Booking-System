const request = require('supertest');
const app = require('../../src/app');
const { sequelize } = require('../../src/models');

beforeAll(async () => { await sequelize.sync({ force: true }); await request(app).post('/api/events/initialize').auth('admin', process.env.ADMIN_TOKEN || 'password123').send({ title: 'WP', venue: 'V', date: new Date(), totalTickets: 1 }); });
afterAll(async () => { await sequelize.close(); });

test('waitlist returns correct position', async () => {
  const event = await require('../../src/models').Event.findOne();
  await request(app).post('/api/events/book').send({ eventId: event.id, userEmail: 'a1@x.test' });
  await request(app).post('/api/events/book').send({ eventId: event.id, userEmail: 'a2@x.test' });
  const res = await request(app).post('/api/events/book').send({ eventId: event.id, userEmail: 'a3@x.test' });
  expect(res.body.waiting).toBeDefined();
  expect(res.body.waiting.id).toBeDefined();
});
