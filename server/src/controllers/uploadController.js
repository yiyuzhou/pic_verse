const path = require('path');

function handleUpload(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: true, message: '未接收到文件' });
  }

  const file = req.file;
  const id = path.basename(file.filename, path.extname(file.filename));

  res.json({
    id,
    filename: file.filename,
    url: `/uploads/${file.filename}`,
    size: file.size,
    mimetype: file.mimetype,
  });
}

module.exports = { handleUpload };
