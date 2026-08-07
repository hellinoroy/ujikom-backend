const express = require("express");
const router = express.Router();
const {
    getAllPeminjam,
    getMyPeminjam,
    getPeminjamById,
    createPeminjam,
    returnBuku,
} = require("../controllers/peminjamController");

const { verifyToken, verifyRole } = require("../middleware/auth");

router.get("/my-borrows", verifyToken, getMyPeminjam);
router.get("/", verifyToken, verifyRole("admin", "petugas"), getAllPeminjam);
router.get("/:id", verifyToken, getPeminjamById);
router.post("/", verifyToken, verifyRole("admin", "petugas"), createPeminjam);
router.put(
    "/return/:id",
    verifyToken,
    verifyRole("admin", "petugas"),
    returnBuku,
);

module.exports = router;
