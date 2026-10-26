# SEO Game Warga

Tujuan: orang yang mencari game ringan berbahasa Indonesia, atau jasa pembuatan aplikasi, menemukan gamewarga.com di Google, Bing, dan mesin pencari lain.

## 1. Siapa yang kita incar dan kata kuncinya

Kata kunci dipilih dari cara orang Indonesia mengetik di HP: pendek, bahasa sehari-hari, sering ditambah "gratis", "online", atau "tanpa download".

| Halaman | Kata kunci utama | Kata kunci pendukung |
|---|---|---|
| `/` portal | game online gratis Indonesia | game browser tanpa download, game ringan HP, game buatan Indonesia, game kasual Indonesia |
| `/siapayangnilep/` | game detektif online | game seperti werewolf bahasa Indonesia, game mafia online, game arisan, game ibu-ibu lucu, game deduksi sosial |
| `/kangparkir/` | game tukang parkir | game parkir motor, game parkir online, game kang parkir, game satu jari |
| `/kantongsemesta/` | game absurd Indonesia | game kresek, game satir Indonesia, game isu viral, game kasual lucu, game satu tangan |
| `/ingusmelerkrl/` | game KRL lucu | game commuter line, game ingus, game absurd Jakarta, game komedi satu jari, game kereta |
| Kartu jasa (portal) | jasa pembuatan aplikasi | jasa bikin website, jasa pembuatan software Indonesia |

Batasan: kata "bandar" dan "tebak" tidak dipakai di judul, deskripsi, dan materi promosi, karena sering kena filter perjudian.

## 2. Yang sudah dipasang (26 Oktober 2026)

- **Satu alamat resmi.** Setiap halaman punya `<link rel="canonical">` ke gamewarga.com. Alamat lama (GitHub Pages, workers.dev) sudah ditutup sejak 26 Oktober 2026: workers.dev mati, dan GitHub Pages hanya halaman pindahan dengan `noindex` dan canonical ke gamewarga.com, jadi Google memindahkan indeksnya ke domain resmi. `www.gamewarga.com` dialihkan permanen (301) ke `gamewarga.com`.
- **Judul dan deskripsi** memuat kata kunci utama, maksimal sekitar 60 dan 160 karakter:
  - Portal: "Game Warga · Game Online Gratis Buatan Indonesia, Langsung Main di HP"
  - "Siapa yang Nilep? · Game Detektif Arisan Online Gratis"
  - "Kang Parkir · Game Tukang Parkir Online Gratis"
- **Data terstruktur (schema.org JSON-LD):**
  - Portal: `Organization` (nama, logo, email, layanan jasa software), `WebSite`, dan `ItemList` berisi daftar game.
  - Setiap game: `VideoGame` (genre, platform, gratis, bahasa Indonesia, penerbit Game Warga).
- **`robots.txt`** mengizinkan semua halaman dan menunjuk ke `sitemap.xml`. Cloudflare menambahkan baris *content signals*-nya sendiri di atas file ini.
- **`sitemap.xml`** berisi portal, kedua game, dan halaman privasinya. Perbarui `lastmod` dan tambah baris setiap kali ada game baru.
- **Ikon situs yang bisa dibaca Google:** `favicon.ico`, `favicon-48.png`, `favicon-192.png`, `apple-touch-icon.png`, `icon-512.png`. Ikon `data:` lama tidak bisa diambil Google untuk hasil pencarian.
- **Pratinjau link (Open Graph)** untuk WA, Facebook, dan X di semua halaman. Kang Parkir sebelumnya belum punya.
- **Isi tanpa JavaScript:** Siapa yang Nilep? menampilkan judul dan deskripsi di `<noscript>`, untuk crawler yang tidak menjalankan JavaScript.
- **Bahasa:** `lang="id"` di semua halaman, dan `inLanguage: id` di data terstruktur.

## 3. Langkah manual (perlu akun pemilik domain)

1. **Google Search Console.** Buka search.google.com/search-console, pilih **Add property → Domain**, dan isi `gamewarga.com`.
   - Verifikasi: pilih **Cloudflare** di daftar penyedia, lalu Google memasang record TXT-nya otomatis.
   - Kirim sitemap: **Sitemaps** → `https://gamewarga.com/sitemap.xml`.
   - Minta indeks untuk tiga halaman utama: **URL Inspection** → masukkan alamatnya → **Request indexing**.
2. **Bing Webmaster Tools.** Buka bing.com/webmasters dan pilih **Import from Google Search Console**. Satu klik ini juga mencakup DuckDuckGo, Yahoo, dan Ecosia, karena mereka memakai indeks Bing.
3. **Cloudflare Crawler Hints.** Di dashboard gamewarga.com, buka **Caching → Configuration → Crawler Hints** dan nyalakan. Setiap halaman berubah, Bing dan Yandex diberi tahu otomatis lewat IndexNow.
4. **Hubungkan GA4 dengan Search Console.** Di GA, buka **Admin → Product links → Search Console links**. Dengan ini, laporan kata kunci pencarian muncul di GA.

## 4. Konten (yang paling menentukan peringkat)

Google mengurutkan hasil berdasarkan seberapa halaman itu menjawab pencarian. Halaman game yang isinya hanya tombol "Main" tipis secara teks. Rencananya:

- **Halaman "Cara main"** per game, misalnya `/siapayangnilep/cara-main`, berisi:
  - teks dan gambar: peran-peran, contoh obrolan, tips mencari pelaku;
  - kata kunci alami seperti "cara main game detektif", "tips game werewolf".
- **Artikel ringan** di `/blog/`, satu per 2 minggu sudah cukup. Contoh:
  - "Aturan arisan RT dan kenapa kas sering 'hilang'"
  - "5 game kasual buatan Indonesia yang bisa dimainkan tanpa download"
  - "Tarif parkir motor di kota-kota Indonesia"
  - Setiap artikel berakhir dengan satu tombol "Main sekarang" (prinsip *Don't Make Me Think*).
- **Halaman jasa** `/jasa/` saat portofolio sudah ada: contoh proyek, proses kerja, satu tombol konsultasi ke halo@gamewarga.com. Kata kunci "jasa pembuatan aplikasi" sangat bersaing, jadi halaman sendiri dengan isi nyata jauh lebih efektif daripada satu kartu di portal.
- **Setiap game baru** (RONDA, petak umpet) mendapat judul dengan kata kunci, deskripsi, canonical, `VideoGame` JSON-LD, baris di `sitemap.xml`, dan satu kartu di portal.

## 5. Tautan dari luar (backlink)

Mesin pencari menilai situs baru dari siapa yang menautkannya. Urut dari usaha paling kecil:

1. **Profil sendiri:** bio TikTok, Instagram, X, YouTube, dan GitHub (`thofik93`) menautkan ke gamewarga.com.
2. **README GitHub** setiap repo game sudah menautkan ke gamewarga.com.
3. **Play Store:** kolom *Website* di listing kedua game diisi alamat game di gamewarga.com.
4. **Portal game indie:** itch.io (halaman game dengan tautan ke gamewarga.com), GameJolt, dan Newgrounds. Untuk distribusi tambahan: CrazyGames dan Poki.
5. **Komunitas Indonesia:** Kaskus (forum Games), r/indonesia dan r/IndieDev di Reddit, grup Facebook "Indie Game Indonesia", dan Asosiasi Game Indonesia (AGI). Ceritakan proses pembuatannya, jangan hanya tempel tautan.
6. **Media:** kirim siaran singkat ke media teknologi dan game lokal (Gamebrott, Kotakgame, Tek.id, DailySocial) saat ada game baru.

Semua tautan promosi memakai UTM sesuai `docs/ANALYTICS.md` bagian 6.

## 6. Mengukur hasil

| Pertanyaan | Lihat di |
|---|---|
| Halaman mana yang sudah terindeks | Search Console → Pages |
| Kata kunci apa yang memunculkan kita, posisi berapa | Search Console → Performance (filter per halaman) |
| Berapa yang datang dari pencarian, lalu benar-benar main | GA4 → Acquisition, sumber `google / organic`, dilanjutkan corong `game_start` |
| Ada masalah tampilan HP atau kecepatan | Search Console → Core Web Vitals |

Situs baru biasanya mulai muncul di Google dalam 1–4 minggu setelah sitemap dikirim. Peringkat untuk kata kunci yang bersaing butuh beberapa bulan konten dan backlink.
