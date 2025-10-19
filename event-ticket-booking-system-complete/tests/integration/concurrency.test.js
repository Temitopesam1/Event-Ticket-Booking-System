const request = require('supertest');
const app = require('../../src/app');
const { sequelize, Event, Booking } = require('../../src/models');
const eventService = require('../../src/services/eventService');

beforeAll(async () => {
  await sequelize.sync({ force: true });
  await eventService.createEvent({ id: 'c1', title: 'Concurrent', venue: 'V', date: new Date(), totalTickets: 3 });
});
afterAll(async () => { await sequelize.close(); });

test('concurrent bookings do not oversell and fill waitlist', async () => {
  const attempts = 10;
  const promises = [];
  for (let i = 0; i < attempts; i++) {
    promises.push(request(app).post('/api/events/book').send({ eventId: 'c1', userId: `u${i}` }));
  }
  const results = await Promise.all(promises);
  const booked = await Booking.count({ where: { eventId: 'c1', status: 'booked' } });
  const waitlisted = await Booking.count({ where: { eventId: 'c1', status: 'waitlisted' } });
  expect(booked).toBeLessThanOrEqual(3);
  expect(booked + waitlisted).toBe(attempts);
});
