# tiktok-vault-cli

CLI Tool dan Antarmuka Web responsif untuk mengunduh video TikTok tanpa watermark secara instan dan efisien.

## Fitur Utama

- **CLI Interaktif:** Ekstraksi dan pengunduhan langsung dari terminal dengan indikator progres.
- **Mode Web UI Elegan:** Menjalankan antarmuka grafis web lokal bergaya modern (Dark Mode / Glassmorphism) cukup dengan satu perintah CLI.
- **Tanpa Watermark:** Mengambil stream resolusi tertinggi langsung dari sumber video publik.
- **Metadata Lengkap:** Menampilkan judul, nama kreator, statistik likes, dan thumbnail resolusi tinggi.
- **Full TypeScript:** Dibangun dengan arsitektur modular, penanganan kesalahan yang kuat, dan tipe data statis.

## Instalasi

```bash
# Clone repositori
git clone https://github.com/your-username/tiktok-vault-cli.git
cd tiktok-vault-cli

# Pasang dependensi
npm install

# Bangun berkas JavaScript
npm run build
```

## Cara Penggunaan

### 1. Menggunakan Mode CLI Langsung
```bash
# Unduh video langsung ke direktori saat ini
node dist/cli.js download "https://www.tiktok.com/@username/video/1234567890"

# Tentukan nama berkas keluaran
node dist/cli.js download "https://vt.tiktok.com/ZS..." --output my_video.mp4
```

### 2. Menjalankan Mode Web Server
```bash
# Jalankan server web lokal dengan antarmuka elegan
node dist/cli.js serve --port 3000
```
Buka browser Anda di `http://localhost:3000` untuk menggunakan antarmuka web.

## Lisensi

MIT License - Dikelola untuk tujuan edukasi dan eksplorasi data publik.