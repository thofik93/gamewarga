/* Portal gamewarga.com: halaman utama dari public/, dan setiap game diteruskan ke Worker milik repo game itu.
   Repo game tetap terpisah dan di-deploy sendiri; portal hanya mengarahkan jalurnya. */
const GAMES = [
  ['/siapayangnilep', 'SIAPAYANGNILEP'],
  ['/kangparkir', 'KANGPARKIR'],
];

export default {
  async fetch(req, env) {
    const { pathname } = new URL(req.url);
    for (const [prefix, binding] of GAMES) {
      if (pathname === prefix || pathname.startsWith(prefix + '/')) return env[binding].fetch(req);
    }
    return env.ASSETS.fetch(req);
  }
};
