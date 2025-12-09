# 💻 Frontend Aplikasi Data Siswa - Uji Kompetensi Keahlian (UKK)

Repository ini berisi source code **Frontend** (Client Side) untuk antarmuka aplikasi Data Siswa. Dibangun menggunakan **React.js** (Vite) dan **Bootstrap** untuk tampilan yang responsif dan modern.

## ✨ Fitur Antarmuka (UI/UX)

* **Auto Code Display**: Menampilkan Kode Siswa otomatis (S-XXX) dengan tampilan *Read-Only* agar user paham bahwa kode dibuat oleh sistem.
* **Validasi & Notifikasi**: Menampilkan pesan *Alert* (Sukses/Gagal) yang informatif, termasuk menangkap pesan error dari Trigger database jika ada data ganda.
* **Responsive Design**: Tampilan rapi di layar desktop maupun mobile menggunakan Bootstrap 5.
* **Single Page Feel**: Interaksi cepat tanpa reload halaman menggunakan State Management React.

## 🛠️ Teknologi yang Digunakan

* **Library**: React.js v18+
* **Build Tool**: Vite
* **Styling**: Bootstrap 5 & Bootstrap Icons
* **HTTP Client**: Axios

## ⚙️ Cara Instalasi & Menjalankan

1.  **Clone Repository**
    ```bash
    git clone [https://github.com/sulukun/frontend-siswa.git](https://github.com/sulukun/frontend-siswa.git)
    cd frontend-siswa
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Jalankan Aplikasi**
    ```bash
    npm run dev
    ```
    Aplikasi biasanya berjalan di `http://localhost:5173`.

## ⚠️ Catatan Penggunaan

Pastikan **Server Backend** sudah berjalan di port `5000` sebelum menjalankan frontend ini, agar data bisa diambil dari database.

---
**Dibuat oleh:** Sulu Edward Julianto