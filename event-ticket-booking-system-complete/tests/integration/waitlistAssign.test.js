const request = require('supertest');
const app = require('../../src/app');
const { sequelize, Booking } = require('../../src/models');
const eventService = require('../../src/services/eventService');

beforeAll(async () => {
  await sequelize.sync({ force: true });
  await eventService.createEvent({ id: 'w1', title: 'Waitlist', venue: 'V', date: new Date(), totalTickets: 1 });
  // book one seat
  await request(app).post('/api/events/book').send({ eventId: 'w1', userId: 'b1' });
  // add two to waitlist
  await request(app).post('/api/events/book').send({ eventId: 'w1', userId: 'wuser1' });
  await request(app).post('/api/events/book').send({ eventId: 'w1', userId: 'wuser2' });
});

afterAll(async () => { await sequelize.close(); });

test('cancelling a booking assigns next waitlist user', async () => {
  // cancel the booked user
  await request(app).post('/api/events/cancel').send({ eventId: 'w1', userId: 'b1' });
  // check that first waitlist user got booked
  const assigned = await Booking.findOne({ where: { eventId: 'w1', userId: 'wuser1' } });
  expect(assigned.status).toBe('booked');
});
