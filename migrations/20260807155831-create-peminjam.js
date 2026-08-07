'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Peminjam', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'User', // Matches the User table name
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      buku_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Buku', // Matches the Buku table name
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      tanggal_pinjam: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      tanggal_jatuh_tempo: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      tanggal_kembali: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      denda: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Peminjam');
  },
};