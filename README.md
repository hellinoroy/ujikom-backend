# Ujikom Backend REST API

Repositori ini merupakan layanan backend RESTful API yang dibuat untuk keperluan **Uji Kompetensi Keahlian (Ujikom)**.

## Prasyarat

Sebelum menjalankan proyek ini, pastikan sistem Anda telah terinstal:
- [Node.js](https://nodejs.org/) (versi 16.x atau lebih baru)
- [npm](https://www.npmjs.com/) atau [yarn](https://yarnpkg.com/)
- [MySQL](https://www.mysql.com/) / [PostgreSQL](https://www.postgresql.org/) Server

## Pengaturan Environment

- Salin file contoh environment dan sesuaikan.

## Dabatabse Migration & Seeder

- npx sequelize-cli db:migration
- npx sequelize-cli db:seeder 

## 📌 Daftar API, Kategori & Parameter

> **Catatan Penting:** Endpoint dengan label **[Protected]** memerlukan token JWT. Tambahkan pada header request Anda:  
> `Authorization: Bearer <token_jwt>`

### 1. 🔐 Kategori: Autentikasi (`/api/auth`)

*   **POST `/api/auth/register` [Public]**
    *   **Deskripsi:** Mendaftarkan pengguna baru.
    *   **Body (JSON):** `nama` (string), `email` (string), `password` (string), `role` (string - opsional, default: "anggota")

*   **POST `/api/auth/login` [Public]**
    *   **Deskripsi:** Masuk ke sistem dan mendapatkan Token JWT.
    *   **Body (JSON):** `email` (string), `password` (string)

---

### 2. 📦 Kategori: Buku (`/api/buku`)

*   **GET `/api/buku` [Public]**
    *   **Deskripsi:** Mendapatkan daftar semua buku.
    *   **Query (Opsional):** `id`, `judul`, `penulis`, `penerbit`, `tahun_terbit`, `kategori_id`

*   **GET `/api/buku/:id` [Public]**
    *   **Deskripsi:** Mendapatkan detail buku berdasarkan ID.
    *   **Params:** `id` (integer/string)

*   **POST `/api/buku` [Protected - Khusus Admin]**
    *   **Deskripsi:** Menambahkan buku baru.
    *   **Body (JSON):** `id` (string/integer), `judul` (string), `penulis` (string), `penerbit` (string), `stok` (integer), `tahun_terbit` (integer/string), `kategori_id` (integer)

*   **PUT `/api/buku/:id` [Protected - Khusus Admin]**
    *   **Deskripsi:** Memperbarui data buku.
    *   **Params:** `id` (integer/string)
    *   **Body (JSON):** `judul` (string), `penulis` (string), `penerbit` (string), `stok` (integer), `tahun_terbit` (integer/string), `kategori_id` (integer)

*   **DELETE `/api/buku/:id` [Protected - Khusus Admin]**
    *   **Deskripsi:** Menghapus buku.
    *   **Params:** `id` (integer/string)

---

### 3. 📑 Kategori: Kategori Buku (`/api/kategori`)

*   **GET `/api/kategori` [Protected - Khusus Admin]**
    *   **Deskripsi:** Mendapatkan daftar semua kategori.

*   **POST `/api/kategori` [Protected - Khusus Admin]**
    *   **Deskripsi:** Menambahkan kategori baru.
    *   **Body (JSON):** `nama_kategori` (string)

*   **PUT `/api/kategori/:id` [Protected - Khusus Admin]**
    *   **Deskripsi:** Memperbarui data kategori.
    *   **Params:** `id` (integer/string)
    *   **Body (JSON):** `nama_kategori` (string)

*   **DELETE `/api/kategori/:id` [Protected - Khusus Admin]**
    *   **Deskripsi:** Menghapus kategori.
    *   **Params:** `id` (integer/string)

---

### 4. 🛒 Kategori: Peminjaman (`/api/peminjam`)

*   **GET `/api/peminjam/my-borrows` [Protected]**
    *   **Deskripsi:** Mendapatkan riwayat peminjaman milik pengguna yang sedang login.

*   **GET `/api/peminjam` [Protected - Khusus Admin & Petugas]**
    *   **Deskripsi:** Mendapatkan semua data peminjaman.
    *   **Query (Opsional):** `user_id`, `buku_id`

*   **GET `/api/peminjam/:id` [Protected]**
    *   **Deskripsi:** Mendapatkan detail peminjaman. Hanya bisa diakses oleh pemilik peminjaman, admin, atau petugas.
    *   **Params:** `id` (integer/string)

*   **POST `/api/peminjam` [Protected - Khusus Admin & Petugas]**
    *   **Deskripsi:** Membuat catatan peminjaman baru (stok buku akan berkurang otomatis).
    *   **Body (JSON):** `user_id` (integer/string), `buku_id` (string/integer)

*   **PUT `/api/peminjam/return/:id` [Protected - Khusus Admin & Petugas]**
    *   **Deskripsi:** Mengembalikan buku (stok buku bertambah, dan menghitung denda keterlambatan jika ada).
    *   **Params:** `id` (integer/string)
    *   **Body (JSON):** `user_id` (integer/string)
