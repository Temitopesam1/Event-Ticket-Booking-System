'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    const events = [
      { title: 'TechFest 2025', venue: 'Lagos Tech Arena', date: new Date('2025-09-10T10:00:00Z'), totalTickets: 50, availableTickets: 50, createdAt: new Date(), updatedAt: new Date() },
      { title: 'Music Fiesta', venue: 'Eko Convention Center', date: new Date('2025-12-10T18:00:00Z'), totalTickets: 30, availableTickets: 30, createdAt: new Date(), updatedAt: new Date() }
    ];
    await queryInterface.bulkInsert('Events', events);
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Events', null, {});
  }
};
