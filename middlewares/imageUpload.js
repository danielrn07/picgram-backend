const multer = require("multer");
const path = require("path");

// Destination to store
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "";

    if (req.baseUrl.includes("user")) {
      golder = "users";
    } else if (req.baseUrl.includes("photos")) {
      folder = "photos";
    }

    cb(null, `uploads/${folder}/`);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const imageUpload = multer({
  storage: imageStorage,
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg)$/)) {
      // Upload only PNG and JPG formats
      return cb(new Error("Formatos de imagem aceitos: png e jpg."));
    }
    cb(undefined, true);
  },
});

module.exports = { imageUpload };
