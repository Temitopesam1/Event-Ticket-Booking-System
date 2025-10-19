const { sequelize, Event, Booking, WaitingList, Order } = require('../models');
const { Op } = require('sequelize');


exports.createEvent = async ({ id, title, venue, date, totalTickets }) => {
  const payload = { title, venue, date, totalTickets, availableTickets: totalTickets };
  if (id) payload.id = id;
  return Event.create(payload);
};
exports.getEvent = async (eventId) => {
  const event = await Event.findByPk(eventId);
  if (!event) { const err = new Error('Event not found'); err.status = 404; throw err; }
  // tests expect an `available` property
  const plain = event.get({ plain: true });
  plain.available = plain.availableTickets;
  return plain;
};
exports.bookTicket = async (eventId, userId) => {
  // lightweight, DB-atomic approach: try to decrement availableTickets in a single UPDATE
  // If update affects 1 row, we secured a seat. Otherwise we're waitlisted.
  const event = await Event.findByPk(eventId);
  if (!event) { const err = new Error('Event not found'); err.status = 404; throw err; }

  const existing = await Booking.findOne({ where: { eventId, userId } });
  if (existing) return { status: existing.status, note: 'Already booked', booking: existing };

  // Attempt atomic decrement
  const [updated] = await Event.update(
    { availableTickets: sequelize.literal('availableTickets - 1') },
    { where: { id: eventId, availableTickets: { [Op.gt]: 0 } } }
  );

  if (updated === 1) {
    const booking = await Booking.create({ eventId, userId, status: 'booked' });
    if (Order) await Order.create({ eventId, userId, action: 'book' });
    return { status: 'booked', booking };
  }

  // No tickets left -> create waitlist Booking
  const wait = await Booking.create({ eventId, userId, status: 'waitlisted' });
  if (Order) await Order.create({ eventId, userId, action: 'waitlist' });
  return { status: 'waitlisted', waiting: wait };
};
exports.cancelBooking = async (eventId, userId) => {
  // Non-transactional cancel: remove user's booking, then promote next waitlist or increment availability.
  const booking = await Booking.findOne({ where: { eventId, userId } });
  if (!booking) { const err = new Error('Booking not found'); err.status = 404; throw err; }

  await booking.destroy();
  if (Order) await Order.create({ eventId, userId, action: 'cancel' });

  const next = await Booking.findOne({ where: { eventId, status: 'waitlisted' }, order: [['createdAt','ASC']] });
  if (next) {
    next.status = 'booked';
    await next.save();
    if (Order) await Order.create({ eventId, userId: next.userId, action: 'assign' });
    return { assignedTo: next.userId, booking: next };
  }

  // No waitlist -> increment availableTickets
  await Event.increment({ availableTickets: 1 }, { where: { id: eventId } });
  return { freed: true };
};
exports.getStatus = async (eventId) => {
  const event = await Event.findByPk(eventId);
  if (!event) { const err = new Error('Event not found'); err.status = 404; throw err; }
  const waitingCount = await Booking.count({ where: { eventId, status: 'waitlisted' } });
  const bookingsCount = await Booking.count({ where: { eventId, status: 'booked' } });
  return { eventId, title: event.title, venue: event.venue, date: event.date, totalTickets: event.totalTickets, availableTickets: event.availableTickets, bookingsCount, waitingCount };
};
