(function(){
  const KEY = 'theme';
  const root = document.documentElement;

  function preferred() {
    return localStorage.getItem(KEY)
      || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }

  function apply(theme) {
    root.setAttribute('data-bs-theme', theme);
    localStorage.setItem(KEY, theme);
    const btn = document.getElementById('themeToggle');
    if (btn) {
      const dark = theme === 'dark';
      btn.setAttribute('aria-pressed', String(dark));
      btn.innerHTML = dark ? '☀️ Claro' : '🌙 Oscuro';
      btn.title = dark ? 'Cambiar a claro' : 'Cambiar a oscuro';
    }
    const sw = document.getElementById('themeSwitch');
    if (sw) sw.checked = (theme === 'dark');
  }

  document.addEventListener('DOMContentLoaded', () => {
    apply(preferred());

    // Botón (ej: <button id="themeToggle">🌙 Oscuro</button>)
    const btn = document.getElementById('themeToggle');
    if (btn) btn.addEventListener('click', () => {
      apply(root.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark');
    });

    // Switch (ej: <input type="checkbox" id="themeSwitch">)
    const sw = document.getElementById('themeSwitch');
    if (sw) sw.addEventListener('change', () => {
      apply(sw.checked ? 'dark' : 'light');
    });

    // Si el usuario no fijó preferencia, sigue cambios del sistema
    if (!localStorage.getItem(KEY)) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener?.('change', e => apply(e.matches ? 'dark' : 'light'));
    }
  });
})();
