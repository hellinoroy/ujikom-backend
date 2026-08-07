'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('buku', [
      {
        id: 'BK-001',
        judul: 'Laskar Pelangi',
        penulis: 'Andrea Hirata',
        penerbit: 'Bentang Pustaka',
        stok: 10,
        tahun_terbit: new Date('2005-01-01'),
        kategori_id: 1, // Fiksi
      },
      {
        id: 'BK-002',
        judul: 'Clean Code',
        penulis: 'Robert C. Martin',
        penerbit: 'Prentice Hall',
        stok: 5,
        tahun_terbit: new Date('2008-08-01'),
        kategori_id: 4, // Pemrograman
      },
      {
        id: 'BK-003',
        judul: 'Filosofi Teras',
        penulis: 'Henry Manampiring',
        penerbit: 'Penerbit Buku Kompas',
        stok: 8,
        tahun_terbit: new Date('2018-11-26'),
        kategori_id: 1, // Fiksi
      },
      {
        id: 'BK-004',
        judul: 'Sapiens: Riwayat Singkat Umat Manusia',
        penulis: 'Yuval Noah Harari',
        penerbit: 'Kepustakaan Populer Gramedia',
        stok: 4,
        tahun_terbit: new Date('2017-09-01'),
        kategori_id: 3, // Sejarah
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('buku', null, {});
  },
};