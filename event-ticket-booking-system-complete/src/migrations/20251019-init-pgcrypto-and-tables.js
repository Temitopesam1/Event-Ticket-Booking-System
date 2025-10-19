'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');
    await queryInterface.createTable('Events', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.literal('gen_random_uuid()') },
      title: { type: Sequelize.STRING, allowNull: false },
      venue: { type: Sequelize.STRING, allowNull: false },
      date: { type: Sequelize.DATE, allowNull: false },
      "totalTickets": { type: Sequelize.INTEGER, allowNull: false },
      "availableTickets": { type: Sequelize.INTEGER, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
    await queryInterface.createTable('Bookings', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.literal('gen_random_uuid()') },
      "eventId": { type: Sequelize.UUID, allowNull: false, references: { model: 'Events', key: 'id' }, onDelete: 'CASCADE' },
      "userEmail": { type: Sequelize.STRING, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
    await queryInterface.createTable('WaitingLists', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.literal('gen_random_uuid()') },
      "eventId": { type: Sequelize.UUID, allowNull: false, references: { model: 'Events', key: 'id' }, onDelete: 'CASCADE' },
      "userEmail": { type: Sequelize.STRING, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('WaitingLists');
    await queryInterface.dropTable('Bookings');
    await queryInterface.dropTable('Events');
  }
};
