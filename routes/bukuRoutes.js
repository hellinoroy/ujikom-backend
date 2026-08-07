// routes/bukuRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllBuku,
  getBukuById,
  createBuku,
  updateBuku,
  deleteBuku
} = require('../controllers/bukuController');

const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

router.get('/', getAllBuku);
router.get('/:id', getBukuById);

router.post('/', verifyToken, verifyRole('admin'), createBuku);
router.put('/:id', verifyToken, verifyRole('admin'), updateBuku);
router.delete('/:id', verifyToken, verifyRole('admin'), deleteBuku);

module.exports = router;