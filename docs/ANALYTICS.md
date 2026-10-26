# Desain Google Analytics: Game Warga

Tujuan: satu tempat untuk melihat performa **setiap game** (berapa yang datang, berapa yang main, berapa yang kembali, dari mana asalnya) dan membandingkan game satu dengan yang lain, tanpa mengumpulkan data pribadi.

Status: **desain**. Belum aktif sampai ada Measurement ID GA4 (`G-XXXXXXX`).

---

## 1. Struktur

| Bagian | Pilihan | Alasan |
|---|---|---|
| Property | **Satu** property GA4 "Game Warga" | Semua game di satu domain, jadi perpindahan antar-game dan retensi portal bisa dilihat. Laporan per game dipisah lewat dimensi `game_id`. |
| Data stream | Satu web stream `gamewarga.com` | Path sudah membedakan game (`/siapayangnilep/`, `/kangparkir/`). |
| Aplikasi Android/iOS (Capacitor) | Pakai web stream yang sama, dengan `page_location` = `https://gamewarga.com/<game>/` dan `platform=android|ios` | Tidak perlu Firebase SDK. Angka app dan web langsung bisa dibandingkan. |
| Pemasangan | Satu skrip bersama `/gw.js` dari portal, dimuat oleh setiap game | Nama event dan aturan privasi dijaga di satu file. Game cukup memanggil `gw.track('game_end', {...})`. |
| Retensi data | 14 bulan | Maksimum di GA4 gratis, cukup untuk membandingkan musim. |

## 2. Privasi dan persetujuan

- **Consent Mode v2, default ditolak** (`analytics_storage: denied`, `ad_storage`, `ad_user_data`, `ad_personalization`: denied, selalu).
- Saat ditolak, GA hanya menerima ping tanpa cookie (dimodelkan). Saat pemain setuju, `analytics_storage` jadi `granted`.
- Persetujuan disimpan sekali untuk satu domain di `gw:consent` (`granted`/`denied`). Siapa yang Nilep? sudah punya pertanyaan "bantu bot belajar" (`P.share`). Jawaban **ya** di sana juga mengisi `gw:consent=granted`, jadi pemain tidak ditanya dua kali.
- Pertanyaan persetujuan muncul **setelah game pertama selesai**, tidak di layar pembuka (sesuai prinsip DMMT: jangan menghalangi orang yang baru mau main).
- Tidak pernah mengirim: nama pemain, isi chat, teks bebas apa pun, email, atau ID perangkat. `user_id` tidak dipakai.
- Google signals **mati**, personalisasi iklan **mati**, alamat IP tidak disimpan (bawaan GA4).
- Halaman privasi tiap game ditambah satu paragraf tentang Google Analytics.

## 3. Event bersama (semua game)

Semua event membawa parameter `game_id` (`siapayangnilep`, `kangparkir`, `ronda`, `portal`) dan `platform` (`web`, `android`, `ios`).

| Event | Kapan | Parameter | Pertanyaan yang dijawab |
|---|---|---|---|
| `page_view` | otomatis | — | Berapa yang datang ke tiap game |
| `game_card_click` | Kartu game di portal diketuk | `game_id`, `position`, `continued` (true jika tombolnya "Lanjutkan") | Game mana yang paling menarik dari portal |
| `game_start` | Permainan dimulai | `mode` (`bot`, `pass`, `daily`, `online`), `players` | Berapa pengunjung yang benar-benar main |
| `level_start` | Babak/hari baru | `level` (hari ke-n) | Di babak mana orang berhenti |
| `game_end` | Permainan selesai | `result` (`win`, `lose`), `duration_s`, `role`, `level` | Tingkat menang, lama main |
| `game_quit` | Keluar sebelum selesai (tab ditutup, kembali ke beranda) | `stage` (`night`, `chat`, `vote`, `day`), `level`, `duration_s` | Titik keluar terbesar |
| `tutorial_begin` / `tutorial_complete` | Cara main dibuka / selesai dibaca | — | Apakah tutorial dibutuhkan |
| `share` | Tombol bagikan | `method` (`native`, `copy`, `wa`), `content_type` (`result`, `invite`) | Seberapa viral |
| `sponsor_view` / `sponsor_click` | Slot sponsor tampil / diketuk | `slot`, `sponsor_id` | Laporan ke sponsor |
| `earn_virtual_currency` / `spend_virtual_currency` | Kue/tabungan bertambah/dipakai | `virtual_currency_name`, `value`, `item_name` | Ekonomi game seimbang atau tidak |
| `unlock_achievement` | Lencana/kosmetik terbuka | `achievement_id` | Apa yang memotivasi main lagi |

Nama event mengikuti event rekomendasi GA4 bila ada (`level_start`, `share`, `earn_virtual_currency`, `unlock_achievement`, `tutorial_*`), supaya laporan bawaan langsung terisi.

## 4. Event khusus per game

### Siapa yang Nilep?

| Event | Parameter | Untuk |
|---|---|---|
| `chat_message` | `intent` (`accuse`, `defend`, `ask`, …), `understood` (true/false), `conf_bucket` (`low`, `mid`, `high`) | Kualitas pemahaman bot di dunia nyata, per versi otak |
| `bot_clarify` | `answered` (true/false) | Apakah pertanyaan konfirmasi bot membantu atau mengganggu |
| `vote_cast` | `correct` (true/false), `level` | Seberapa sulit menebak pelaku |
| `sidang_start` | `level` | Seberapa sering terjadi sidang |

Isi pesan **tidak pernah** dikirim, hanya label hasil pemahaman.

### Kang Parkir

| Event | Parameter |
|---|---|
| `level_start` | `level` (hari), `location`, `tariff` |
| `level_end` | `level`, `earned`, `target_met`, `escaped` |
| `vehicle_escaped` | `vehicle` (`motor`, `mobil`), `level` |

### RONDA (saat terbit)

`room_create`, `room_join` (`players`), `ghost_caught` (`ghost`), plus event bersama.

## 5. Dimensi dan metrik khusus

Daftarkan di **Admin → Custom definitions** (parameter yang tidak didaftarkan tidak bisa dipakai di laporan):

| Nama | Cakupan | Parameter |
|---|---|---|
| Game | Event | `game_id` |
| Platform | Event | `platform` |
| Mode | Event | `mode` |
| Hasil | Event | `result` |
| Peran | Event | `role` |
| Tahap keluar | Event | `stage` |
| Maksud chat | Event | `intent` |
| Dipahami | Event | `understood` |
| Slot sponsor | Event | `slot` |
| Sponsor | Event | `sponsor_id` |
| Versi otak | Event | `brain_version` |
| Eksperimen | Event | `exp` (contoh `probe:on,callout:off`) |
| Game pertama | User | `first_game_id` |
| Jumlah main | User | `games_played_bucket` (`1`, `2-4`, `5-19`, `20+`) |
| Durasi (detik) | Metrik | `duration_s` |
| Hari/level | Metrik | `level` |

**Key events (konversi):** `game_start`, `game_end`, `share`, `sponsor_click`.

## 6. Laporan dan dashboard

Satu laporan Looker Studio "Game Warga" dengan filter `game_id` di bagian atas. Setiap halaman menjawab satu pertanyaan:

1. **Ringkasan per game**: pengguna, `game_start` per pengguna, `game_end` / `game_start` (tingkat selesai), median `duration_s`, pengguna kembali D1/D7. Satu baris per game, mudah dibandingkan.
2. **Corong (funnel)** per game: `page_view` → `game_start` → `level_start (level=2)` → `game_end` → `game_start` kedua. Dibuat di Explore → Funnel exploration, dipecah per `platform`.
3. **Retensi kohort**: Explore → Cohort exploration, kohort = minggu pertama main, dipecah per `first_game_id`.
4. **Akuisisi**: sumber/medium per game. Semua tautan promosi memakai UTM:
   `?utm_source=<tiktok|ig|wa|x>&utm_medium=<social|story|group>&utm_campaign=<game>-<yyyymm>&utm_content=<varian>`
5. **Main lintas game**: Explore → Path exploration dari `game_end` di satu game ke `game_card_click` game lain. Pertanyaannya: apakah pemain Siapa yang Nilep? juga mencoba Kang Parkir?
6. **Titik keluar**: `game_quit` per `stage` dan `level`.
7. **Sponsor**: `sponsor_view`, `sponsor_click`, CTR per `sponsor_id`/`slot`. Halaman ini yang dikirim ke sponsor sebagai bukti tayang.
8. **Kualitas bot** (Siapa yang Nilep?): persentase `understood=true` per `intent` dan `brain_version`, tingkat `bot_clarify` dijawab. Pelengkap laporan `scripts/train.mjs`, bukan pengganti, karena GA tidak melihat isi pesan.
9. **Eksperimen**: `game_end` per `exp` (tingkat menang, durasi, main lagi). Bisa dibandingkan dengan `ArisanSim.strategyStats`.

## 7. Pemasangan teknis (setelah ada Measurement ID)

1. Portal menyajikan `/gw.js`: memuat `gtag.js`, mengatur consent default ditolak, membaca `gw:consent`, dan menyediakan:
   ```js
   gw.track(name, params)   // menambah game_id & platform otomatis
   gw.consent(true|false)   // simpan ke gw:consent dan update consent
   ```
2. Setiap game menambah `<script src="/gw.js" defer></script>` dan memanggil `window.gw?.track(...)` di titik-titik di atas. Jika skrip gagal dimuat (offline, diblokir), `gw` tidak ada dan game tetap jalan.
3. Build Capacitor: `gw.js` dibundel ke `www/` dan mengirim `page_location` dengan domain gamewarga.com.
4. Verifikasi di **Admin → DebugView** dengan `?gw_debug=1`, lalu cek laporan Realtime.
5. Daftarkan dimensi khusus (bagian 5) dan tandai key events.
6. Perbarui halaman privasi tiap game.

## 8. Yang tidak dilakukan

- Tidak ada remarketing atau audiens iklan.
- Tidak ada pelacakan lintas situs, tidak ada `user_id`.
- Tidak ada event per ketukan atau per pesan selain label `chat_message`. Batas GA4 adalah 500 nama event per property dan 50 dimensi khusus. Desain ini memakai sekitar 25 nama event dan 14 dimensi khusus.
