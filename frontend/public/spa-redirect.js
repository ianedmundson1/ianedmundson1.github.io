// GitHub Pages SPA fallback. Pages serves 404.html for any unknown path; we
// stash the requested location and redirect to "/", where bootstrap.js
// restores it via history.replaceState before React boots. Without this,
// deep-link refreshes 404.
(function () {
  var path = location.pathname + location.search + location.hash;
  sessionStorage.setItem('spa-redirect', path);
  location.replace('/');
})();
