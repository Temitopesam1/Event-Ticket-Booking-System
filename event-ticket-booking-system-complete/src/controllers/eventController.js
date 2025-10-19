const svc = require('../services/eventService');


exports.create = async (req, res, next) => {
  try {
    const payload = req.body;
    const event = await svc.createEvent(payload);
    res.status(201).json(event);
  } catch (err) { next(err); }
};
exports.book = async (req, res, next) => {
  try {
    const { eventId, userEmail, userId } = req.body;
    // accept either userEmail or userId (tests use both)
    const email = userEmail || userId;
    if (!eventId || !email) {
      return res.status(400).json({ error: { message: 'eventId and userEmail (or userId) are required' } });
    }
    const result = await svc.bookTicket(eventId, email);
    res.json(result);
  } catch (err) { next(err); }
};
exports.cancel = async (req, res, next) => {
  try {
    const { eventId, userEmail, userId } = req.body;
    const email = userEmail || userId;
    if (!eventId || !email) {
      return res.status(400).json({ error: { message: 'eventId and userEmail (or userId) are required' } });
    }
    const result = await svc.cancelBooking(eventId, email);
    res.json(result);
  } catch (err) { next(err); }
};
exports.status = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const result = await svc.getStatus(eventId);
    res.json(result);
  } catch (err) { next(err); }
};
