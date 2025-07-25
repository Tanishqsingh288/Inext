const express = require('express');
const router = express.Router();
const AuthMiddleware = require('../middleware/AuthMiddleware');
const { getAllUsers } = require('../controllers/UserController');

router.get('/', AuthMiddleware, getAllUsers);
module.exports = router;
