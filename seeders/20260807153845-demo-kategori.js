'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('Kategori', [
        {
            nama_kategori: 'Fiksi',
        },
        {
            nama_kategori: 'Sains & Teknologi',
        },
        {
            nama_kategori: 'Sejarah',
        },
        {
            nama_kategori: 'Pemrograman',
        },
        {
            nama_kategori: 'Komik & Novel Grafis',
        },
        ]);
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Kategori', null, {});
    }
};
