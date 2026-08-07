'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('peminjam', [
      {
        user_id: 3,
        buku_id: 'BK-001',
        tanggal_pinjam: new Date('2026-02-01'),
        tanggal_jatuh_tempo: new Date('2026-02-08'),
        tanggal_kembali: new Date('2026-02-07'),
        status: 'Dikembalikan',
        denda: 0,
      },
      {
        user_id: 3,
        buku_id: 'BK-002',
        tanggal_pinjam: new Date('2026-02-01'),
        tanggal_jatuh_tempo: new Date('2026-02-08'),
        tanggal_kembali: new Date('2026-02-10'), // 2 days late
        status: 'Terlambat',
        denda: 4000, // 2 days * Rp 2.000
      },
      {
        user_id: 3,
        buku_id: 'BK-003',
        tanggal_pinjam: new Date(),
        tanggal_jatuh_tempo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 days
        tanggal_kembali: null,
        status: 'Dipinjam',
        denda: 0,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('peminjam', null, {});
  },
};