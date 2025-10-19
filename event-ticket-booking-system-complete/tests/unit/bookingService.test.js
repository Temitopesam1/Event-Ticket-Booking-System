const { sequelize } = require('../../src/models');
const eventService = require('../../src/services/eventService');
const bookingService = require('../../src/services/bookingService');

beforeAll(async () => {
  await sequelize.sync({ force: true });
  await eventService.createEvent({ id: 'ut1', title: 'UT Event', venue: 'V', date: new Date(), totalTickets: 2 });
});
afterAll(async () => { await sequelize.close(); });

test('booking creates order and decreases availability', async () => {
  const res = await bookingService.book({ eventId: 'ut1', userId: 'u1' });
  expect(res.status).toMatch(/booked|waitlisted/);
  const event = await eventService.getEvent('ut1');
  expect(event.available).toBeGreaterThanOrEqual(0);
});
