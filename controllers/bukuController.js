const { Buku } = require('../models');
const { Op } = require('sequelize');

// 1. Get all books
const getAllBuku = async (req, res) => {
  try {
    const { id, judul, penulis, penerbit, tahun_terbit, kategori_id} = req.query;
    const search = {};

    if(id){
        search.id = parseInt(id);
    }

    if(judul) {
        search.judul = {[Op.like]: `%${judul}%`};
    }

    if(penulis) {
        search.penulis = {[Op.like]: `%${penulis}%`};
    }
    
    if(penerbit) {
        search.penerbit = {[Op.like]: `%${penerbit}%`};
    }

    if(tahun_terbit) {
        search.tahun_terbit = tahun_terbit;
    }

    if(kategori_id) {
        search.kategori_id = parseInt(kategori_id);
    }

    const buku = await Buku.findAll({
        where: search
    });
    
    if (buku.length == 0 && Object.keys(search).length != 0) {
      return res.status(404).json({
        message: 'Buku tidak ditemukan'
      });
    }
    

    return res.status(200).json(buku);
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

const getBukuById = async (req, res) => {
  try {
    const { id } = req.params;
    const buku = await Buku.findByPk(id);

    if (!buku) {
      return res.status(404).json({
        message: 'Buku tidak ditemukan'
      });
    }

    return res.status(200).json(buku);
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};


const createBuku = async (req, res) => {
  try {
    const { id, judul, penulis, penerbit, stok, tahun_terbit, kategori_id } = req.body;

    if (!id || !judul || !penulis || !penerbit || stok === undefined || !tahun_terbit || !kategori_id) {
      return res.status(400).json({
        message: 'Semua field (id, judul, penulis, penerbit, stok, tahun_terbit, kategori_id) wajib diisi'
      });
    }

    const newBuku = await Buku.create({
      id,
      judul,
      penulis,
      penerbit,
      stok,
      tahun_terbit,
      kategori_id
    });

    return res.status(201).json({
      message: 'Buku berhasil ditambahkan',
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

const updateBuku = async (req, res) => {
  try {
    const { id } = req.params;
    const { judul, penulis, penerbit, stok, tahun_terbit, kategori_id } = req.body;

    const buku = await Buku.findByPk(id);

    if (!buku) {
      return res.status(404).json({
        message: 'Buku tidak ditemukan'
      });
    }

    await buku.update({
      judul: judul ?? buku.judul,
      penulis: penulis ?? buku.penulis,
      penerbit: penerbit ?? buku.penerbit,
      stok: stok ?? buku.stok,
      tahun_terbit: tahun_terbit ?? buku.tahun_terbit,
      kategori_id: kategori_id ?? buku.kategori_id
    });

    return res.status(200).json({
      message: 'Buku berhasil diperbarui',
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

const deleteBuku = async (req, res) => {
  try {
    const { id } = req.params;

    const buku = await Buku.findByPk(id);

    if (!buku) {
      return res.status(404).json({
        message: 'Buku tidak ditemukan'
      });
    }

    await buku.destroy();

    return res.status(200).json({
      message: 'Buku berhasil dihapus'
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  getAllBuku,
  getBukuById,
  createBuku,
  updateBuku,
  deleteBuku
};