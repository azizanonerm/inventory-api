# Inventory API

REST API untuk manajemen inventaris gudang. Proyek portofolio backend dengan Node.js, Express, TypeScript, PostgreSQL, dan Prisma ORM 7.

## Fitur

- CRUD produk dan kategori
- Filter produk berdasarkan kategori
- Pencatatan stok masuk (`IN`) dan stok keluar (`OUT`)
- Pencegahan stok menjadi negatif
- Riwayat pergerakan stok
- Validasi request menggunakan Zod
- Error handler terpusat
- Database migration dan seed data
- Automated validation tests
- Docker Compose untuk menjalankan API dan PostgreSQL
- Dokumentasi OpenAPI di `docs/openapi.yaml`

## Teknologi

- Node.js 20+
- TypeScript
- Express 5
- PostgreSQL
- Prisma ORM 7
- Zod

## Menjalankan secara lokal

1. Install dependency:

   ```bash
   npm install
   ```

2. Buat `.env` berdasarkan `.env.example`, lalu isi `DATABASE_URL`.

3. Jalankan migration dan generate client:

   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

4. Isi data contoh:

   ```bash
   npm run db:seed
   ```

5. Jalankan server:

   ```bash
   npm run dev
   ```

Server berjalan di `http://localhost:3000`.

### Dengan Docker Compose

Pastikan Docker aktif, lalu jalankan:

```bash
docker compose up --build
```

Perintah tersebut menjalankan PostgreSQL, migration, dan API pada port `3000`.

## Validasi proyek

```bash
npm run build
npm test
npx prisma validate
```

Dokumentasi endpoint tersedia di `docs/openapi.yaml` dan dapat dibuka menggunakan Swagger Editor atau Swagger UI.

## Endpoint utama

| Method | Endpoint | Keterangan |
| --- | --- | --- |
| GET | `/health` | Cek status API |
| GET | `/products` | Daftar produk |
| GET | `/products/:id` | Detail produk |
| POST | `/products` | Membuat produk |
| PATCH | `/products/:id` | Mengubah produk |
| DELETE | `/products/:id` | Menghapus produk |
| GET | `/categories` | Daftar kategori |
| POST | `/categories` | Membuat kategori |
| GET | `/stock-movements` | Riwayat stok |
| POST | `/stock-movements` | Mencatat stok masuk/keluar |

### Contoh membuat produk

```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Keyboard Mechanical","sku":"KB-001","stock":10,"price":750000,"categoryId":1}'
```

### Contoh stock movement

```bash
curl -X POST http://localhost:3000/stock-movements \
  -H "Content-Type: application/json" \
  -d '{"productId":1,"type":"OUT","quantity":2,"note":"Penjualan"}'
```

Stock movement memperbarui stok produk dan menyimpan riwayatnya dalam satu database transaction. Operasi `OUT` ditolak jika stok tidak mencukupi.

## Struktur proyek

```text
src/
├── middlewares/      # Error handler
├── routes/           # Endpoint API
├── utils/            # Helper umum
├── validation/       # Schema validasi dan tests
├── lib/              # Prisma client
├── app.ts            # Konfigurasi Express
└── server.ts         # Entry point server
prisma/
├── migrations/       # Database migrations
├── schema.prisma     # Database schema
└── seed.ts           # Data contoh
```

## Catatan desain

Perubahan stok dilakukan melalui endpoint `/stock-movements`, bukan dengan mengubah stok secara langsung, sehingga setiap perubahan dapat dilacak.
