const assert = require('node:assert/strict');
const test = require('node:test');

process.env.BOOKS_ADMIN_API_KEY = 'test-only-admin-key-not-for-deployment';

const { isAuthorizedMutationKey, requireMutationKey } = require('../mutationAuth');

test('API key mutation yang benar diterima', () => {
  assert.equal(isAuthorizedMutationKey('test-only-admin-key-not-for-deployment'), true);
});

test('API key mutation yang salah atau kosong ditolak', () => {
  assert.equal(isAuthorizedMutationKey('wrong-key'), false);
  assert.equal(isAuthorizedMutationKey(undefined), false);
});

test('middleware menolak mutation dengan respons generic', () => {
  let nextCalled = false;
  let statusCode;
  let body;
  const req = { get: () => 'wrong-key' };
  const res = {
    status(code) { statusCode = code; return this; },
    json(value) { body = value; return this; },
  };

  requireMutationKey(req, res, () => { nextCalled = true; });

  assert.equal(nextCalled, false);
  assert.equal(statusCode, 401);
  assert.deepEqual(body, { error: true, message: 'Tidak diizinkan.' });
});
