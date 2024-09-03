const multer = require("multer");
const path = require("path");

// Defino storage para Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder;

    if (file.fieldname === "profile") {
      folder = path.resolve(__dirname, "../uploads/profiles");
    } else if (file.fieldname === "image") {
      folder = path.resolve(__dirname, "../public/img");
    } else {
      //Carpeta por default
      folder = path.resolve(__dirname, "../uploads/documents");
    }
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
module.exports = upload;
