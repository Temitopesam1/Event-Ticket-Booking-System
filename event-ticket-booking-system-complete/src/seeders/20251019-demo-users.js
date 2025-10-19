'use strict';
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = [];
    const created = [];
    // admin
    const adminEmail = `admin_${uuidv4()}@demo.com`;
    const adminPass = Math.random().toString(36).slice(-8);
    const adminHash = await bcrypt.hash(adminPass, 10);
    users.push({ email: adminEmail, password: adminHash, role: 'admin', createdAt: new Date(), updatedAt: new Date() });
    created.push({ email: adminEmail, password: adminPass, role: 'admin' });
    // normal users
    for (let i=0;i<3;i++) {
      const email = `user_${uuidv4()}@demo.com`;
      const pass = Math.random().toString(36).slice(-8);
      const hash = await bcrypt.hash(pass, 10);
      users.push({ email, password: hash, role: 'user', createdAt: new Date(), updatedAt: new Date() });
      created.push({ email, password: pass, role: 'user' });
    }
    // We will store users in a lightweight table 'DemoUsers' (not part of main auth). Create table if not exists
    await queryInterface.createTable('DemoUsers', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.literal('gen_random_uuid()') },
      email: { type: Sequelize.STRING, allowNull: false },
      password: { type: Sequelize.STRING, allowNull: false },
      role: { type: Sequelize.STRING, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });
    await queryInterface.bulkInsert('DemoUsers', users);
    // Log generated credentials to console for reviewer (note: sequelize-cli will run this in environment where console is visible)
    console.log('--- Demo credentials (plaintext) ---');
    created.forEach(u => console.log(`${u.role}: ${u.email} / ${u.password}`));
    console.log('-----------------------------------');
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('DemoUsers', null, {});
    await queryInterface.dropTable('DemoUsers');
  }
};
