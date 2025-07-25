const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../uploads'),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, JPEG, PNG files are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter }).single('photo');

function uploadPhoto(req, res) {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const relativePath = path.posix.join('uploads', req.file.filename);

    res.status(200).json({
      message: 'Upload successful',
      photoPath: relativePath
    });
  });
}

module.exports = { uploadPhoto };
