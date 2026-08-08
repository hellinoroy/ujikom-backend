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

### 1. 🔐 Kategori: Autentikasi

*   **POST `/api/auth/register` [Public]**
    *   **Deskripsi:** Mendaftarkan pengguna baru.
    *   **Body (JSON):** `name` (string), `email` (string), `password` (string), `role` (string)

*   **POST `/api/auth/login` [Public]**
    *   **Deskripsi:** Masuk ke sistem dan mendapatkan Token JWT.
    *   **Body (JSON):** `email` (string), `password` (string)

*   **GET `/api/auth/me` [Protected]**
    *   **Deskripsi:** Mengambil data profil yang sedang login.
    *   **Headers:** `Authorization: Bearer <token>`

---

### 2. 👥 Kategori: Manajemen Pengguna (Users)

*   **GET `/api/users` [Protected]**
    *   **Deskripsi:** Mendapatkan seluruh data user (Khusus Admin).
    *   **Query (Opsional):** `?page=1&limit=10`

*   **GET `/api/users/:id` [Protected]**
    *   **Deskripsi:** Mendapatkan detail user berdasarkan ID.
    *   **Params:** `id` (integer)

*   **PUT `/api/users/:id` [Protected]**
    *   **Deskripsi:** Memperbarui data user.
    *   **Params:** `id` (integer)
    *   **Body (JSON):** `name` (string), `email` (string), `role` (string)

*   **DELETE `/api/users/:id` [Protected]**
    *   **Deskripsi:** Menghapus user dari sistem (Khusus Admin).
    *   **Params:** `id` (integer)

---

### 3. 📦 Kategori: Data Master (Produk/Item)

*   **GET `/api/items` [Protected]**
    *   **Deskripsi:** Menampilkan seluruh data master.
    *   **Query (Opsional):** `?search=nama`

*   **POST `/api/items` [Protected]**
    *   **Deskripsi:** Menambahkan data master baru.
    *   **Body (JSON):** `nama_item` (string), `harga` (integer), `deskripsi` (string), `stok` (integer)

*   **PUT `/api/items/:id` [Protected]**
    *   **Deskripsi:** Mengubah detail data master.
    *   **Params:** `id` (integer)
    *   **Body (JSON):** `nama_item` (string), `harga` (integer), `deskripsi` (string), `stok` (integer)

*   **DELETE `/api/items/:id` [Protected]**
    *   **Deskripsi:** Menghapus data master.
    *   **Params:** `id` (integer)

---

### 4. 🛒 Kategori: Transaksi

*   **GET `/api/transactions` [Protected]**
    *   **Deskripsi:** Melihat riwayat transaksi.

*   **POST `/api/transactions` [Protected]**
    *   **Deskripsi:** Membuat transaksi baru.
    *   **Body (JSON):** 
        *   `user_id` (integer)
        *   `items` (Array of Object): `[{ "item_id": 1, "qty": 2 }]`
        *   `total_harga` (integer)

*   **PUT `/api/transactions/:id/status` [Protected]**
    *   **Deskripsi:** Mengubah status transaksi.
    *   **Params:** `id` (integer)
    *   **Body (JSON):** `status` (string, contoh: "selesai" atau "lunas")
