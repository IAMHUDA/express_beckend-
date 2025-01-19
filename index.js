const express = require("express");
const app = express();
const port = 3000;

// Import router
const anggotaRouter = require("./routes/anggota");
const bukuRouter = require("./routes/buku");

// Middleware
const cors = require("cors");
app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Gunakan router untuk masing-masing endpoint
app.use("/api/buku", bukuRouter);
app.use("/api/anggota", anggotaRouter);

// Jalankan server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
