const assert = require('node:assert/strict');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

test('production gagal tertutup ketika konfigurasi wajib tidak tersedia', () => {
  const result = spawnSync(
    process.execPath,
    ['-e', "require('./config')"],
    {
      cwd: path.resolve(__dirname, '..'),
      encoding: 'utf8',
      env: { NODE_ENV: 'production', PATH: process.env.PATH },
    }
  );

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Database production wajib/);
});

test('production menolak admin API key pendek dan origin HTTP', () => {
  const baseEnvironment = {
    NODE_ENV: 'production',
    PATH: process.env.PATH,
    DATABASE_URL: 'postgres://placeholder.invalid/books',
    BOOKS_ADMIN_API_KEY: 'too-short',
    CORS_ORIGINS: 'https://portfolio.example',
  };
  const shortKey = spawnSync(process.execPath, ['-e', "require('./config')"], {
    cwd: path.resolve(__dirname, '..'),
    encoding: 'utf8',
    env: baseEnvironment,
  });

  assert.notEqual(shortKey.status, 0);
  assert.match(shortKey.stderr, /minimal 32 karakter/);

  const httpOrigin = spawnSync(process.execPath, ['-e', "require('./config')"], {
    cwd: path.resolve(__dirname, '..'),
    encoding: 'utf8',
    env: {
      ...baseEnvironment,
      BOOKS_ADMIN_API_KEY: 'test-only-placeholder-at-least-32-characters',
      CORS_ORIGINS: 'http://portfolio.example',
    },
  });

  assert.notEqual(httpOrigin.status, 0);
  assert.match(httpOrigin.stderr, /wajib menggunakan HTTPS/);
});
