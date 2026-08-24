const fs = require('node:fs');

require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

function requireProductionValue(name) {
  const value = process.env[name]?.trim();
  if (isProduction && !value) {
    throw new Error(`Konfigurasi production wajib belum tersedia: ${name}`);
  }
  return value;
}

function databaseCa() {
  if (process.env.DB_CA?.trim()) {
    return process.env.DB_CA.replace(/\\n/g, '\n');
  }

  const caPath = process.env.DB_CA_PATH?.trim();
  return caPath ? fs.readFileSync(caPath, 'utf8') : undefined;
}

const connectionString = process.env.DATABASE_URL?.trim();
const hasDiscreteDatabaseConfig = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME']
  .every((name) => Boolean(process.env[name]?.trim()));

if (isProduction && !connectionString && !hasDiscreteDatabaseConfig) {
  throw new Error(
    'Database production wajib memakai DATABASE_URL atau seluruh DB_HOST/DB_USER/DB_PASSWORD/DB_NAME.'
  );
}

const corsOriginsValue = requireProductionValue('CORS_ORIGINS') || 'http://localhost:5173';
const adminApiKey = requireProductionValue('BOOKS_ADMIN_API_KEY');

if (isProduction && adminApiKey.length < 32) {
  throw new Error('BOOKS_ADMIN_API_KEY production minimal 32 karakter acak.');
}

const corsOrigins = corsOriginsValue.split(',').map((item) => item.trim()).filter(Boolean);
if (isProduction && corsOrigins.some((origin) => new URL(origin).protocol !== 'https:')) {
  throw new Error('Seluruh CORS_ORIGINS production wajib menggunakan HTTPS.');
}
const ca = databaseCa();

module.exports = {
  adminApiKey,
  corsOrigins,
  database: {
    connectionString,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT || 5432),
    ssl: isProduction || process.env.DB_SSL === 'true'
      ? {
          rejectUnauthorized: true,
          ...(ca ? { ca } : {}),
        }
      : false,
  },
  isProduction,
};
