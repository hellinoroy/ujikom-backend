'use strict';

const bcrypt = require('bcrypt');
const saltRounds = 10;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('password123', saltRounds);

    await queryInterface.bulkInsert('users', [
      {
        nama: 'Admin',
        email: 'admin@library.com',
        password: hashedPassword,
        role: 'admin',
      },
      {
        nama: 'Petugas',
        email: 'petugas@library.com',
        password: hashedPassword,
        role: 'petugas',
      },
      {
        nama: 'Ryo',
        email: 'ryo@gmail.com',
        password: hashedPassword,
        role: 'anggota',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};