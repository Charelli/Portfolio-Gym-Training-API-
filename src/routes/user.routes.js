const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/user.controller');

router.get('/', getProfile);
router.patch('/', updateProfile);

module.exports = router;
