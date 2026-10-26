/* Game Warga analytics (GA4). Satu file untuk semua game, desain di docs/ANALYTICS.md.
   Pemakaian di game:
     <script src="https://gamewarga.com/gw.js" data-game="kangparkir" async></script>
     (window.gwq=window.gwq||[]).push(['game_start',{mode:'bot'}]);   // event
     (window.gwq=window.gwq||[]).push(['_consent',true]);              // persetujuan pemain
   Tanpa persetujuan GA hanya menerima ping tanpa cookie. Tidak pernah mengirim nama, isi chat, atau ID perangkat. */
(function () {
  var ID = 'G-KQKB2QGY83';
  var me = document.currentScript;
  var game = (me && me.dataset.game) || 'portal';
  var C = window.Capacitor;
  var platform = C && C.isNativePlatform && C.isNativePlatform() ? (C.getPlatform ? C.getPlatform() : 'app') : 'web';
  if (location.protocol === 'file:' && platform === 'web') return; // uji otomatis dan pratinjau lokal

  var KEY = 'gw:consent';
  var read = function () { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
  var write = function (v) { try { localStorage.setItem(KEY, v); } catch (e) {} };

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  var denied = { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' };
  gtag('consent', 'default', denied);
  if (read() === 'granted') gtag('consent', 'update', { analytics_storage: 'granted' });
  gtag('js', new Date());
  // aplikasi HP (Capacitor, host localhost) juga dilaporkan sebagai alamat gamewarga.com
  var path = game === 'portal' ? '/' : '/' + game + '/';
  var cfg = {
    page_location: 'https://gamewarga.com' + path + location.search,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    game_id: game,
    platform: platform
  };
  if (/[?&]gw_debug=1/.test(location.search)) cfg.debug_mode = true; // debug_mode:false pun tetap menyalakan DebugView
  gtag('config', ID, cfg);

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
  document.head.appendChild(s);

  function run(item) {
    var name = item[0], params = item[1] || {};
    if (name === '_consent') {
      write(params ? 'granted' : 'denied');
      gtag('consent', 'update', { analytics_storage: params ? 'granted' : 'denied' });
      return;
    }
    var p = { game_id: game, platform: platform };
    for (var k in params) if (params[k] !== undefined && params[k] !== null) p[k] = params[k];
    gtag('event', name, p);
  }
  var q = window.gwq || [];
  window.gwq = { push: function () { for (var i = 0; i < arguments.length; i++) run(arguments[i]); } };
  for (var i = 0; i < q.length; i++) run(q[i]);
  window.gw = { consent: function () { return read(); } };
})();
