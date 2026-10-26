# Game Warga

Portal game indie tentang kehidupan warga: **gamewarga.com**.

| Jalur | Game | Repo |
|---|---|---|
| `/` | Beranda portal | repo ini (`public/`) |
| `/siapayangnilep/` | Siapa yang Nilep? (ARISAN) | thofik93/arisan |
| `/kangparkir/` | Kang Parkir | thofik93/kang-parkir |
| `/ronda/` | RONDA (segera) | belum dipublikasikan |

## Cara kerja
Worker `gamewarga` (`src/index.js`) menyajikan beranda dari `public/` dan meneruskan setiap jalur game ke Worker milik repo game itu lewat *service binding*. Setiap game di-deploy sendiri dari repo-nya (`node scripts/build-web.mjs && npx wrangler deploy -c web/wrangler.toml`), jadi satu game tidak bisa merusak game lain. Domain hanya dipasang di Worker portal.

Data permainan setiap game tersimpan di perangkat dengan awalan sendiri (`arisan:`, `kangparkir:`, `ronda:`), jadi tidak bentrok walaupun berbagi domain.

## Deploy
```bash
npx wrangler@4.152.0 deploy
```
Alamat Worker cadangan: https://gamewarga.thofik93.workers.dev

## Analytics
Desain Google Analytics 4 untuk semua game: [docs/ANALYTICS.md](docs/ANALYTICS.md).

SEO (kata kunci, sitemap, data terstruktur, Search Console, rencana konten): [docs/SEO.md](docs/SEO.md).
