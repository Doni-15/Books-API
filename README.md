# Books API

Books API adalah latihan backend sederhana untuk operasi CRUD data buku menggunakan Express dan PostgreSQL. Endpoint pencarian menggunakan parameterized query untuk filter judul, penulis, dan penerbit.

## Endpoint yang Tersedia

| Method | Path | Kegunaan |
| --- | --- | --- |
| `GET` | `/books` | Menampilkan atau memfilter buku |
| `GET` | `/books/:id` | Mengambil satu buku |
| `POST` | `/books` | Menambah buku; memerlukan admin API key |
| `PUT` | `/books/:id` | Memperbarui buku; memerlukan admin API key |
| `DELETE` | `/books/:id` | Menghapus buku; memerlukan admin API key |

## Teknologi

- Node.js dan Express
- PostgreSQL melalui `pg`
- Vercel serverless configuration

## Konfigurasi

Salin `.env.example` menjadi `.env`, lalu isi credential database lokal. Jangan commit `.env`.

```bash
npm install
npm test
npm start
```

Endpoint baca bersifat public. Endpoint perubahan data memakai header `x-api-key`; nilainya wajib berasal dari `BOOKS_ADMIN_API_KEY`, tidak boleh ditulis di source atau dokumentasi. `CORS_ORIGINS` berisi allowlist origin yang dipisahkan koma.

Pada production, konfigurasi berhenti lebih awal bila API key, CORS allowlist, atau database belum tersedia. TLS database selalu memverifikasi sertifikat; provider dengan CA private dapat memakai `DB_CA` atau `DB_CA_PATH`.

## Keputusan Desain Keamanan

CRUD adalah inti latihan ini, tetapi project belum mempunyai model pengguna multi-user. Karena itu mutation dilindungi dengan satu admin API key dari environment, sementara `GET` tetap public. Desain kecil ini lebih sesuai dengan scope coursework daripada menambahkan sistem identitas yang tidak dibuktikan oleh project.

## Status dan Batasan

CommonJS dan akses pool sudah dibuat konsisten. Unit test mencakup kontrol API key; pengujian integrasi CRUD tetap membutuhkan instance PostgreSQL dan belum tersedia pada repository.
