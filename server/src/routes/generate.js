const { Router } = require('express');
const { validateGenerateRequest } = require('../middleware/validateRequest');
const { handleGenerate } = require('../controllers/generateController');

const router = Router();

router.post('/', validateGenerateRequest, handleGenerate);

module.exports = router;
