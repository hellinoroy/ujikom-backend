const { Kategori } = require('../models');

const getAllKategori = async (req, res) => {
    try {
        const kategori = await Kategori.findAll();
        
        return res.status(200).json(kategori);
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};


const createKategori = async (req, res) => {
    try {
        const { nama_kategori } = req.body;
        
        if (!nama_kategori) {
            return res.status(400).json({
                message: 'Nama kategori wajib diisi'
            });
        }
        
        await Kategori.create({ nama_kategori });
        
        return res.status(201).json({
            message: 'Kategori berhasil ditambahkan',
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

const updateKategori = async (req, res) => {
    try {
        const { id } = req.params;
        const { nama_kategori } = req.body;
        
        const kategori = await Kategori.findByPk(id);
        
        if (!kategori) {
            return res.status(404).json({
                message: 'Kategori tidak ditemukan'
            });
        }
        
        if (!nama_kategori) {
            return res.status(400).json({
                message: 'Nama kategori tidak boleh kosong'
            });
        }
        
        await kategori.update({ nama_kategori });
        
        return res.status(200).json({
            message: 'Kategori berhasil diperbarui',
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

const deleteKategori = async (req, res) => {
    try {
        const { id } = req.params;
        
        const kategori = await Kategori.findByPk(id);
        
        if (!kategori) {
            return res.status(404).json({
                message: 'Kategori tidak ditemukan'
            });
        }
        
        await kategori.destroy();
        
        return res.status(200).json({
            message: 'Kategori berhasil dihapus'
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getAllKategori,
    createKategori,
    updateKategori,
    deleteKategori
};