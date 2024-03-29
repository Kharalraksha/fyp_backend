const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // specify the destination directory
  },
  filename: function (req, file, cb) {
    // Use the original filename for the uploaded image
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage }).array("image_url", 5); // Accept up to 10 files.

module.exports = upload;
