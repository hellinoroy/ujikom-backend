// controllers/peminjamController.js
const { Peminjam, Buku, sequelize } = require('../models');

// 1. Get all borrowings (Admin / Staff view)
const getAllPeminjam = async (req, res) => {
  try {
    const peminjam = await Peminjam.findAll();

    return res.status(200).json(peminjam);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 2. Get borrowing history for a user
const getMyPeminjam = async (req, res) => {
  try {
    const userId = req.user.id;

    const peminjam = await Peminjam.findAll({
      where: { user_id: userId }
    });

    return res.status(200).json(peminjam);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 3. Get single borrowing record by ID (Owner, Admin, or Petugas only)
const getPeminjamById = async (req, res) => {
  try {
    const { id } = req.params;
    const peminjam = await Peminjam.findByPk(id);

    if (!peminjam) {
      return res.status(404).json({ message: 'Data peminjaman tidak ditemukan' });
    }

    const isOwner = peminjam.user_id === req.user.id;
    const isAdminOrPetugas = ['admin', 'petugas'].includes(req.user.role);

    if (!isOwner && !isAdminOrPetugas) {
      return res.status(403).json({ 
        message: 'Akses ditolak: Anda tidak berhak melihat data peminjaman ini' 
      });
    }

    return res.status(200).json(peminjam);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 4. Create borrowing (user_id taken from req.body)
const createPeminjam = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { user_id, buku_id } = req.body;

    if (!user_id || !buku_id) {
      await transaction.rollback();
      return res.status(400).json({ message: 'user_id dan buku_id wajib diisi' });
    }

    // Check book existence and stock
    const buku = await Buku.findByPk(buku_id, { transaction });
    if (!buku) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Buku tidak ditemukan' });
    }

    if (buku.stok <= 0) {
      await transaction.rollback();
      return res.status(422).json({ message: 'Stok buku telah habis' });
    }

    // Check active borrows count for the provided user_id
    const activeBorrowsCount = await Peminjam.count({
      where: {
        user_id: user_id,
        status: 'dipinjam'
      },
      transaction
    });

    if (activeBorrowsCount >= 3) {
      await transaction.rollback();
      return res.status(422).json({
        message: 'Gagal meminjam: User telah mencapai batas maksimal 3 peminjaman aktif'
      });
    }

    // Create borrowing record (tanggal_pinjam defaults to today via model)
    const newPeminjam = await Peminjam.create({
      user_id,
      buku_id,
      tanggal_pinjam: new Date(),
      status: 'dipinjam'
    }, { transaction });

    // Decrement book stock by 1
    await buku.decrement('stok', { by: 1, transaction });

    await transaction.commit();

    return res.status(201).json({
      message: 'Berhasil meminjam buku',
      data: newPeminjam
    });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ message: error.message });
  }
};

// 5. Return book (user_id verified from req.body & fine calculation)
const returnBuku = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      await transaction.rollback();
      return res.status(400).json({ message: 'user_id wajib diisi' });
    }

    const peminjam = await Peminjam.findByPk(id, { transaction });

    if (!peminjam) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Data peminjaman tidak ditemukan' });
    }

    // Verify that the borrowing record matches the provided user_id
    if (peminjam.user_id !== Number(user_id)) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Data peminjaman tidak sesuai dengan user_id yang diberikan' });
    }

    if (peminjam.status === 'dikembalikan') {
      await transaction.rollback();
      return res.status(400).json({ message: 'Buku ini sudah dikembalikan sebelumnya' });
    }

    // Restore stock
    const buku = await Buku.findByPk(peminjam.buku_id, { transaction });
    if (buku) {
      await buku.increment('stok', { by: 1, transaction });
    }

    // Fine calculation: Rp 2.000 per missed day
    const returnDate = new Date();
    const dueDate = new Date(peminjam.tanggal_jatuh_tempo);

    let denda = 0;
    if (returnDate > dueDate) {
      const diffInTime = returnDate.getTime() - dueDate.getTime();
      const diffInDays = Math.ceil(diffInTime / (1000 * 60 * 60 * 24));
      denda = diffInDays * 2000;
    }

    // Update borrowing status, return date, and final denda
    await peminjam.update({
      tanggal_kembali: returnDate,
      status: 'dikembalikan',
      denda: denda
    }, { transaction });

    await transaction.commit();

    return res.status(200).json({
      message: 'Buku berhasil dikembalikan',
      data: peminjam
    });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllPeminjam,
  getMyPeminjam,
  getPeminjamById,
  createPeminjam,
  returnBuku
};