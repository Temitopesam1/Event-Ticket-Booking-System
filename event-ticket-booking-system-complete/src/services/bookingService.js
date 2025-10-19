const eventService = require('./eventService');

// Thin shim kept for historical tests and clearer surface API.
exports.book = async ({ eventId, userId, userEmail }) => {
  const uid = userId || userEmail;
  return eventService.bookTicket(eventId, uid);
};

exports.cancel = async ({ eventId, userId, userEmail }) => {
  const uid = userId || userEmail;
  return eventService.cancelBooking(eventId, uid);
};

exports.status = async (eventId) => eventService.getStatus(eventId);
