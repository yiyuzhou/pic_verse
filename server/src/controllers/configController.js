const config = require('../config');

function getConfig(req, res) {
  res.json(config.getMasked());
}

function updateConfig(req, res) {
  const { gptimage2, nanobanana } = req.body;

  const update = {};
  if (gptimage2) {
    update.gptimage2 = {};
    if (gptimage2.url !== undefined) update.gptimage2.url = gptimage2.url;
    if (gptimage2.key !== undefined) update.gptimage2.key = gptimage2.key;
  }
  if (nanobanana) {
    update.nanobanana = {};
    if (nanobanana.url !== undefined) update.nanobanana.url = nanobanana.url;
    if (nanobanana.key !== undefined) update.nanobanana.key = nanobanana.key;
  }

  config.update(update);
  res.json({ success: true });
}

module.exports = { getConfig, updateConfig };
