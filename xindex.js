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
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded"
    });
  }

  res.json({
    success: true,
    filename: req.file.filename,
    originalname: req.file.originalname,
    size: req.file.size
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
