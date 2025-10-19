const { sequelize, Event, Booking, WaitingList } = require('../models');

(async () => {
  try {
    await sequelize.sync();
    console.log('Creating demo events via models...');
    const e1 = await Event.create({ title: 'TechFest 2025', venue: 'Lagos Tech Arena', date: new Date('2025-09-10T10:00:00Z'), totalTickets: 50, availableTickets: 50 });
    const e2 = await Event.create({ title: 'Music Fiesta', venue: 'Eko Convention Center', date: new Date('2025-12-10T18:00:00Z'), totalTickets: 30, availableTickets: 30 });
    console.log('Created events:', e1.id, e2.id);
    console.log('Model-based seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Model seeding failed', err);
    process.exit(1);
  }
})();
