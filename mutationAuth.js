const crypto = require('node:crypto');
const { adminApiKey } = require('./config');

function digest(value) {
  return crypto.createHash('sha256').update(value).digest();
}

function isAuthorizedMutationKey(candidate) {
  if (!adminApiKey || typeof candidate !== 'string' || !candidate) {
    return false;
  }
  return crypto.timingSafeEqual(digest(candidate), digest(adminApiKey));
}

function requireMutationKey(req, res, next) {
  if (!adminApiKey) {
    return res.status(503).json({
      error: true,
      message: 'Operasi perubahan data belum dikonfigurasi.',
    });
  }

  if (!isAuthorizedMutationKey(req.get('x-api-key'))) {
    return res.status(401).json({ error: true, message: 'Tidak diizinkan.' });
  }

  return next();
}

module.exports = { isAuthorizedMutationKey, requireMutationKey };
