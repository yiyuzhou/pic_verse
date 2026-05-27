const { Router } = require('express');
const { VALID_MODELS, VALID_STYLES, VALID_FILTERS } = require('../middleware/validateRequest');

const router = Router();

router.get('/', (req, res) => {
  res.json({
    models: VALID_MODELS,
    styles: VALID_STYLES,
    filters: VALID_FILTERS,
  });
});

module.exports = router;
