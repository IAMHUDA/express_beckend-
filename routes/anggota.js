const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const db = require("../config/database"); // Pastikan Anda sudah membuat file database.js untuk koneksi MySQL

// Get all anggota
router.get("/", (req, res) => {
  db.query("SELECT * FROM anggota", (err, results) => {
    if (err) return res.status(500).json({ status: false, message: "Internal Server Error" });
    res.status(200).json({ status: true, message: "Success", data: results });
  });
});

// Get anggota by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM anggota WHERE id_anggota = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ status: false, message: "Internal Server Error" });
    if (results.length === 0)
      return res.status(404).json({ status: false, message: "Anggota tidak ditemukan" });
    res.status(200).json({ status: true, message: "Success", data: results[0] });
  });
});

// Create anggota
router.post("/",
  [
    body("id_anggota").notEmpty().withMessage("ID Anggota harus diisi"),
    body("nama").notEmpty().withMessage("Nama harus diisi"),
    body("email").isEmail().withMessage("Email tidak valid"),
    body("no_telpon").notEmpty().withMessage("No Telepon harus diisi"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: false, message: errors.array() });
    }

    const { id_anggota, nama, email, no_telpon } = req.body;
    db.query(
      "INSERT INTO anggota (id_anggota, nama, email, no_telpon) VALUES (?, ?, ?, ?)",
      [id_anggota, nama, email, no_telpon],
      (err) => {
        if (err) return res.status(500).json({ status: false, message: "Internal Server Error", error: err.message });
        res.status(201).json({ status: true, message: "Anggota berhasil ditambahkan" });
      }
    );
  }
);

// Update anggota
router.put("/:id",
  [
    body("nama").notEmpty().withMessage("Nama harus diisi"),
    body("email").isEmail().withMessage("Email tidak valid"),
    body("no_telpon").notEmpty().withMessage("No Telepon harus diisi"),
  ],
  (req, res) => {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: false, message: errors.array() });
    }

    const { nama, email, no_telpon } = req.body;
    db.query(
      "UPDATE anggota SET nama = ?, email = ?, no_telpon = ? WHERE id_anggota = ?",
      [nama, email, no_telpon, id],
      (err, results) => {
        if (err) return res.status(500).json({ status: false, message: "Internal Server Error" });
        if (results.affectedRows === 0)
          return res.status(404).json({ status: false, message: "Anggota tidak ditemukan" });
        res.status(200).json({ status: true, message: "Anggota berhasil diperbarui" });
      }
    );
  }
);

// Delete anggota
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM anggota WHERE id_anggota = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ status: false, message: "Internal Server Error" });
    if (results.affectedRows === 0)
      return res.status(404).json({ status: false, message: "Anggota tidak ditemukan" });
    res.status(200).json({ status: true, message: "Anggota berhasil dihapus" });
  });
});

module.exports = router;
