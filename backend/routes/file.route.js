const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = require('../config/Multer');
const { uploadresume, analyzeResume } = require('../controllers/fileUpload.Controller');

router.post('/upload', upload.single('resume'), uploadresume);
router.post('/analyze/:id', analyzeResume);

module.exports = router;