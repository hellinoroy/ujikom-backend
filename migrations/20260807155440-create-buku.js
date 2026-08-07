'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Buku', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      judul: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      penulis: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      penerbit: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      stok: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      tahun_terbit: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      kategori_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Kategori', 
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Buku');
  },
};