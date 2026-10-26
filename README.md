# Game Warga

Portal game indie tentang kehidupan warga, sekaligus etalase jasa pembuatan software: **https://gamewarga.com**. Kontak: halo@gamewarga.com.

| Jalur | Game | Repo |
|---|---|---|
| `/` | Beranda portal | repo ini (`public/`) |
| `/siapayangnilep/` | Siapa yang Nilep? (ARISAN) | thofik93/arisan |
| `/kangparkir/` | Kang Parkir | thofik93/kang-parkir |
| `/kantongsemesta/` | Kantong Semesta | thofik93/kantong-semesta |
| `/ingusmelerkrl/` | Ingus Meler KRL | /Applications/projets/ingus-meler-krl (belum di GitHub) |
| `/ronda/` | RONDA (segera) | belum dipublikasikan |

## Cara kerja
Worker `gamewarga` (`src/index.js`) menyajikan beranda dari `public/` dan meneruskan setiap jalur game ke Worker milik repo game itu lewat *service binding*. Setiap game di-deploy sendiri dari repo-nya (`node scripts/build-web.mjs && npx wrangler deploy -c web/wrangler.toml`), jadi satu game tidak bisa merusak game lain.

| Alamat | Worker | Catatan |
|---|---|---|
| `gamewarga.com` | `gamewarga` | Domain utama |
| `www.gamewarga.com` | `gamewarga` | Dialihkan permanen (301) ke `gamewarga.com` |
| `api.gamewarga.com` | `arisan-brain` (repo arisan, `server/`) | Server belajar bot Siapa yang Nilep? |
| `/siapayangnilep/brain.json`, `/siapayangnilep/sponsors.json` | `gamewarga` | Diambil langsung dari `main` repo arisan di GitHub (cache 5 menit), jadi PR belajar yang digabung langsung berlaku tanpa deploy |

**Hanya lewat domain resmi.** Semua Worker memakai `workers_dev = false` dan `preview_urls = false`, jadi alamat `*.workers.dev` dan URL pratinjau mati. Worker game hanya bisa dijangkau lewat portal.

**GitHub Pages lama** (`thofik93.github.io/arisan`, `/kang-parkir`) hanya berisi halaman pindahan di cabang `gh-pages` repo masing-masing. Halaman itu membawa progres pemain (tersimpan per domain) ke gamewarga.com lewat `#gw-import`, lalu mengalihkan. Setelah 1–2 bulan, Pages bisa dimatikan total.

**Email.** `halo@gamewarga.com` dan alamat catch-all diteruskan ke Gmail pemilik lewat Cloudflare Email Routing. Untuk membalas sebagai halo@, pakai fitur "Send mail as" di Gmail (SMTP `smtp.gmail.com` dengan App Password), dan tambahkan `include:_spf.google.com` ke record SPF.

Data permainan setiap game tersimpan di perangkat dengan awalan sendiri (`arisan:`, `kangparkir:`, `kantong:`, `ingus:`, `ronda:`), jadi tidak bentrok walaupun berbagi domain.

## Deploy
```bash
export CLOUDFLARE_API_TOKEN="$(tr -d '[:space:]' < ~/.config/arisan/cf-token)" CLOUDFLARE_ACCOUNT_ID=9ec46ef884059fc2bd70ee74e5c86666
npx wrangler@4.152.0 deploy
```
Domain dipasang lewat `routes` (custom domain) di `wrangler.toml`. Token belum punya izin DNS; record DNS dan Email Routing diatur lewat dashboard Cloudflare.

## Isi `public/`
- `index.html`: beranda (daftar game, "Lanjutkan" untuk game yang pernah dimainkan, kartu jasa software).
- `gw.js`: Google Analytics bersama untuk semua game.
- `robots.txt`, `sitemap.xml`, `favicon.*`, `apple-touch-icon.png`, `icon-512.png`, `og.png`, `img/`.

## Menambah game baru
1. Repo game membangun `dist-web/<jalur>/` dan punya `web/wrangler.toml` dengan `workers_dev = false`.
2. Tambah `[[services]]` di `wrangler.toml` portal dan barisnya di `GAMES` (`src/index.js`).
3. Tambah kartu di `public/index.html` (dengan `data-key` untuk "Lanjutkan"), baris di `sitemap.xml`, dan `ItemList` di JSON-LD.
4. Di game: muat `gw.js` dengan `data-game="<jalur>"`, canonical ke `https://gamewarga.com/<jalur>/`, `VideoGame` JSON-LD, tautan "← Game Warga", dan awalan `localStorage` sendiri.

## Analytics
Google Analytics 4 (`G-KQKB2QGY83`) untuk semua game: [docs/ANALYTICS.md](docs/ANALYTICS.md).

SEO (kata kunci, sitemap, data terstruktur, Search Console, rencana konten): [docs/SEO.md](docs/SEO.md).
