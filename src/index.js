/* Portal gamewarga.com: halaman utama dari public/, dan setiap game diteruskan ke Worker milik repo game itu.
   Repo game tetap terpisah dan di-deploy sendiri; portal hanya mengarahkan jalurnya. */
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
    for (const [prefix, binding] of GAMES) {
      if (pathname === prefix || pathname.startsWith(prefix + '/')) return env[binding].fetch(req);
    }
    return env.ASSETS.fetch(req);
  }
};
