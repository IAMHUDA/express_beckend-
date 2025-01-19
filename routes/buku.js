const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const db = require("../config/database");

// Get all buku
router.get("/", (req, res) => {
  db.query("SELECT * FROM buku ORDER BY id_buku DESC", (err, rows) => {
    if (!err) {
      return res.status(200).json({
        status: true,
        message: "Success",
        data: rows,
      });
    } else {
      return res.status(500).json({
        status: false,
        message: "Internal Server Error",
      });
    }
  });
});

// Get buku by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM buku WHERE id_buku = ?", [id], (err, rows) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: "Internal Server Error",
      });
    } else {
      if (rows.length > 0) {
        return res.status(200).json({
          status: true,
          message: "Success",
          data: rows[0],
        });
      } else {
        return res.status(404).json({
          status: false,
          message: "Buku tidak ditemukan",
        });
      }
    }
  });
});

// Create buku
router.post(
  "/buku",
  [
    body("id_buku").notEmpty(),
    body("judul").notEmpty(),
    body("penulis").notEmpty(),
    body("kategori").notEmpty(),
    body("status").isIn(["available", "notavailable"]),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        status: false,
        message: errors.array(),
      });
    }

    const { id_buku, judul, penulis, kategori, status } = req.body;
    db.query(
      "INSERT INTO buku (id_buku, judul, penulis, kategori, status) VALUES (?, ?, ?, ?, ?)",
      [id_buku, judul, penulis, kategori, status],
      (err) => {
        if (err) {
          return res.status(500).json({
            status: false,
            message: "Internal Server Error",
            error: err,
          });
        } else {
          return res.status(201).json({
            status: true,
            message: "Buku berhasil ditambahkan",
            data: { id_buku, judul, penulis, kategori, status },
          });
        }
      }
    );
  }
);

// Update buku
router.put(
  "/:id",
  [
    body("judul").notEmpty(),
    body("penulis").notEmpty(),
    body("kategori").notEmpty(),
    body("status").isIn(["available", "notavailable"]),
  ],
  (req, res) => {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        status: false,
        message: errors.array(),
      });
    }

    const { judul, penulis, kategori, status } = req.body;
    db.query(
      "UPDATE buku SET judul = ?, penulis = ?, kategori = ?, status = ? WHERE id_buku = ?",
      [judul, penulis, kategori, status, id],
      (err, results) => {
        if (err) {
          return res.status(500).json({
            status: false,
            message: "Internal Server Error",
          });
        } else {
          if (results.affectedRows === 0) {
            return res.status(404).json({
              status: false,
              message: "Buku tidak ditemukan",
            });
          } else {
            return res.status(200).json({
              status: true,
              message: "Buku berhasil diperbarui",
              data: { id_buku: id, judul, penulis, kategori, status },
            });
          }
        }
      }
    );
  }
);

// Delete buku
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM buku WHERE id_buku = ?", [id], (err, results) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: "Internal Server Error",
      });
    } else {
      if (results.affectedRows === 0) {
        return res.status(404).json({
          status: false,
          message: "Buku tidak ditemukan",
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "Buku berhasil dihapus",
        });
      }
    }
  });
});

module.exports = router;
