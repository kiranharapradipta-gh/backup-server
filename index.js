const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Buat folder uploads jika belum ada
const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Konfigurasi penyimpanan
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const folder = req.body.folder || "unknown";
console.log(req.body)
    const uploadPath = path.join(__dirname, "uploads", folder);

    // buat folder kalau belum ada
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },

  filename(req, file, cb) {
    const safeName = file.originalname.replace(/\s/g, "_");
    const finalName = `${Date.now()}_${safeName}`;
    cb(null, finalName);
  }
});

const upload = multer({ storage });

// Home
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Upload 1 file
app.post("/upload", upload.single("file"), (req, res) => {

  console.log("QUERY:", req.query);
  console.log("FILE:", req.file);

  const folder = req.query.folder || "unknown";

  const uploadPath = path.join(__dirname, "uploads", folder);

  fs.mkdirSync(uploadPath, { recursive: true });

  // pindahkan file ke folder yang benar
  const oldPath = req.file.path;
  const newPath = path.join(uploadPath, req.file.filename);

  fs.renameSync(oldPath, newPath);

  res.json({
    ok: true,
    folder,
    file: req.file.filename
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
