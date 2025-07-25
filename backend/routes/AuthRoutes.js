const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/AuthenticationController');
const AuthMiddleware = require('../middleware/AuthMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
