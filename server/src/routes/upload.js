const { Router } = require('express');
const upload = require('../middleware/uploadMiddleware');
const { handleUpload } = require('../controllers/uploadController');

const router = Router();

router.post('/', upload.single('image'), handleUpload);

module.exports = router;
