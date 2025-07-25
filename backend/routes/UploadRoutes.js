const express = require('express');
const router = express.Router();
const { uploadPhoto } = require('../controllers/UploadController');

router.post('/photo', uploadPhoto);

module.exports = router;
