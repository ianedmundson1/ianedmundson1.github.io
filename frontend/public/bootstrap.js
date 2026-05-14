// Runs synchronously before React mounts. Two responsibilities:
//   1. Apply the persisted (or system-preferred) theme so the first paint
//      already has the correct color-scheme.
//   2. Restore any deep-link path stashed by the GitHub Pages 404 fallback
//      (see public/spa-redirect.js).
(function () {
  var theme = localStorage.getItem('theme');
  if (!theme) {
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.documentElement.setAttribute('data-theme', theme);
})();

(function () {
  var redirect = sessionStorage.getItem('spa-redirect');
  if (redirect) {
    sessionStorage.removeItem('spa-redirect');
    if (redirect !== location.pathname + location.search + location.hash) {
      history.replaceState(null, '', redirect);
    }
  }
})();
