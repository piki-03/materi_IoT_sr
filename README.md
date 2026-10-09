# 🤖 Sentral Robotika - Studio Presentasi IoT & Tutorial Wokwi Blynk

Aplikasi web interaktif **Sentral Robotika** dirancang sebagai **pengganti PPT interaktif (ala Canva)** dengan estetika visual khas **Saweria** (dark theme arang modern, aksen kuning-emas `#FAAE2B`, kartu rounded modern). Web ini digunakan untuk mengajar dan belajar integrasi **Wokwi Simulator** dengan **Blynk Cloud 2.0 (ESP32)**, dilengkapi alat pemindai **OCR Foto ke Token Blynk** siap pakai.

---

## 🔑 Kredensial Akses Masuk (Rahasia)

Aplikasi ini memiliki dua mode akses utama:

| Peran | Kode Akses | Fitur |
|---|---|---|
| **👨‍🏫 Guru** | **`guru_masuk`** | Edit teks, **edit kode C++**, ganti gambar, tambah/hapus bab. |
| **🎓 Murid** | **`murid_go`** | Hanya baca, salin kode, simulasi Wokwi. |

### Cara Menggunakan Mode Guru:
1. Jalankan aplikasi (buka `index.html`).
2. Pada layar login, klik kartu **Guru / Pengajar**.
3. Masukkan kode: `guru_masuk`.
4. Klik **🚀 Masuk Sekarang**.
5. Anda sekarang dapat mengklik teks judul, poin materi, atau **blok kode C++** untuk mengubah isinya secara langsung. Perubahan disimpan secara otomatis.

### Cara Menggunakan Mode Murid:
1. Pada layar login, klik kartu **Murid / Siswa**.
2. Masukkan kode: `murid_go`.
3. Klik **🚀 Masuk Sekarang**.
4. Mode ini aman untuk belajar tanpa risiko merusak materi asli.

> 💡 **Tips:** Untuk berpindah mode, klik tombol **"Keluar"** atau **"Login Guru"** di pojok kanan atas layar.
> 💡 **Beralih Akun:** Pengguna dapat berpindah akun kapan saja melalui tombol **"Keluar"** atau **"Login Guru"** yang terdapat pada badge peran di pojok kanan atas bilah navigasi (topbar).

---

## ⚡ Fitur Utama

### 1. Workspace Presentasi Ala Canva (Pengganti PPT)
- **Sidebar Thumbnail Bab (Kiri)**: Daftar kartu bab tutorial (Bab 1 s.d. Bab 5 bawaan).
- **Tombol `+ Tambah Bab Baru`**: Menambahkan materi slide baru secara instan.
- **Live Inline Editor (Khusus Guru)**: Klik elemen teks atau kode untuk mengedit langsung.
- **Upload Gambar Skema (Khusus Guru)**: Tombol *Ganti / Upload Gambar* untuk memperbarui ilustrasi rangkaian.
- **Penyimpanan Otomatis (Auto-Save)**: Materi tersimpan di memori browser pengguna (`LocalStorage`), dilengkapi tombol **Ekspor JSON** untuk mencadangkan materi ke file dan **Impor JSON** untuk memuat kembali file slide.

### 2. Fitur Foto ke Token Siap Copy (OCR)
- Klik tombol **"Foto ke Token (OCR)"** atau tekan tombol **`Ctrl + V`** di mana saja untuk langsung menempelkan screenshot dari clipboard.
- Memindai screenshot dashboard Blynk dan menghasilkan **1 blok kode utuh 3 baris** siap salin:
  ```cpp
  #define BLYNK_TEMPLATE_ID "TMPL62U0xhnR2"
  #define BLYNK_TEMPLATE_NAME "Kontrol Led dgn Blynk"
  #define BLYNK_AUTH_TOKEN "mbbOARWNhGvXh5uQBztvb5DFvA15m_9I"
  ```
- Tombol **`SALIN SEMUA TOKEN`** menyalin ketiga baris di atas sekaligus dalam 1 kali klik.
- Tombol **`⚡ Terapkan ke Kode Slide Ini`** (khusus Guru) untuk langsung memperbarui kode bab aktif.

### 3. Mode Presentasi Layar Penuh (F5 / Fullscreen)
- Tekan tombol **Mode Presentasi (F5)** atau tekan tombol **`F`** pada keyboard untuk mode layar penuh tanpa bilah editor (cocok untuk presentasi di proyektor kelas atau share screen).
- Dilengkapi bilah pengendali mengambang (*Floating HUD*) dan navigasi keyboard:
  - `▶` (Panah Kanan) / `Spasi`: Slide Selanjutnya
  - `◀` (Panah Kiri): Slide Sebelumnya
  - `F`: Toggle Layar Penuh
  - `ESC`: Keluar dari Mode Presentasi / Tutup Dialog

### 4. Materi Bawaan Wokwi & Blynk ESP32
Web sudah dilengkapi 5 bab kurikulum lengkap:
- **Bab 1**: Pengenalan Wokwi Simulator & Blynk IoT 2.0 (Arsitektur Sistem).
- **Bab 2**: Konfigurasi Template & Datastream di Blynk.Cloud (V0, V1, V2).
- **Bab 3**: Skema Rangkaian Wokwi ESP32 + LED & DHT22 (Diagram Interaktif).
- **Bab 4**: Penulisan Program Lengkap ESP32 Blynk 2.0 (C++).
- **Bab 5**: Uji Coba Simulasi Real-Time & Troubleshooting.

---

## 🚀 Cara Menjalankan

Cukup buka berkas **`index.html`** langsung menggunakan browser internet (Google Chrome, Microsoft Edge, Mozilla Firefox, dll.):

```
file:///D:/SENTRAL_ROBOTIK/WEB_SENTRAL_ROBOTIKA/index.html
```

Aplikasi ini 100% berjalan di sisi browser (*client-side*), tidak memerlukan instalasi backend maupun server rumit, dan dapat dijalankan secara offline maupun online.
