const request = require('supertest');
const app = require('../../src/app');
const { sequelize, Booking } = require('../../src/models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});
afterAll(async () => { await sequelize.close(); });

test('booking and cancellation create audit/order entries', async () => {
  // create event
  await request(app).post('/api/events/initialize').auth('admin', process.env.ADMIN_TOKEN || 'password123').send({ title: 'O1', venue: 'V', date: new Date(), totalTickets: 1 });
  // book
  await request(app).post('/api/events/book').send({ eventId: (await require('../../src/models').Event.findOne()).id, userEmail: 'audit@x.test' });
  // cancel
  await request(app).post('/api/events/cancel').send({ eventId: (await require('../../src/models').Event.findOne()).id, userEmail: 'audit@x.test' });

  // Expect an Orders table/model to exist and have rows (this test should fail until audit is implemented)
  const Orders = require('../../src/models').Order;
  const rows = await Orders.findAll();
  expect(rows.length).toBeGreaterThanOrEqual(2);
});
