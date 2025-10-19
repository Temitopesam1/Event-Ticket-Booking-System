const request = require('supertest');
const app = require('../../src/app');
const { sequelize } = require('../../src/models');

beforeAll(async () => { await sequelize.sync({ force: true }); await require('../../src/services/eventService').createEvent({ title:'Test', venue:'X', date: new Date(), totalTickets:1 }); });
afterAll(async () => { await sequelize.close(); });

test('global rate limiter responds with 429 after threshold', async () => {
  const event = (await require('../../src/models').Event.findOne()).toJSON();
  const max = 200; // global limiter max
  const requests = Array.from({ length: max + 5 }).map(() => request(app).get(`/api/events/status/${event.id}`));
  const results = await Promise.all(requests);
  const tooMany = results.filter(r => r.status === 429).length;
  expect(tooMany).toBeGreaterThan(0);
}, 30000);
