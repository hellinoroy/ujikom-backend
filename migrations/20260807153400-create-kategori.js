'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.createTable('Kategori', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            nama_kategori: {
                type: Sequelize.STRING,
                allowNull: false,
            },
        });
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.dropTable('Kategori');
    }
};
