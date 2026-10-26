/* Portal gamewarga.com: halaman utama dari public/, dan setiap game diteruskan ke Worker milik repo game itu.
   Repo game tetap terpisah dan di-deploy sendiri; portal hanya mengarahkan jalurnya. */
// File data yang diperbarui lewat repo (PR belajar mingguan, daftar sponsor): diambil langsung dari GitHub
// supaya selalu mengikuti main tanpa deploy ulang. Di-cache 5 menit di Cloudflare.
const LIVE_FILES = {
  '/siapayangnilep/brain.json': 'https://raw.githubusercontent.com/thofik93/arisan/main/brain.json',
  '/siapayangnilep/sponsors.json': 'https://raw.githubusercontent.com/thofik93/arisan/main/sponsors.json',
};

const GAMES = [
  ['/siapayangnilep', 'SIAPAYANGNILEP'],
  ['/kangparkir', 'KANGPARKIR'],
];

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const { pathname } = url;
    // satu alamat resmi: www diarahkan ke gamewarga.com
    if (url.hostname === 'www.gamewarga.com') {
      url.hostname = 'gamewarga.com';
      return Response.redirect(url.toString(), 301);
    }
    if (LIVE_FILES[pathname]) {
      const r = await fetch(LIVE_FILES[pathname], { cf: { cacheTtl: 300, cacheEverything: true } });
      if (r.ok) return new Response(r.body, { headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'public, max-age=300', 'access-control-allow-origin': '*' } });
      // GitHub sedang bermasalah: pakai salinan yang ikut di-deploy bersama game
    }
    for (const [prefix, binding] of GAMES) {
      if (pathname === prefix || pathname.startsWith(prefix + '/')) return env[binding].fetch(req);
    }
    return env.ASSETS.fetch(req);
  }
};
