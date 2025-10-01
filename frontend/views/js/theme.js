(function(){
  const KEY = 'theme';
  const root = document.documentElement;

  // 1) Aplicar el tema lo antes posible (evita FOUC)
  const initial = localStorage.getItem(KEY) || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  root.setAttribute('data-bs-theme', initial);

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

  // Helper opcional para usar desde HTML/otros scripts
  window.toggleTheme = () => apply(root.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark');

  document.addEventListener('DOMContentLoaded', () => {
    // 2) Reaplicar por si cambió la preferencia antes de cargar
    apply(preferred());

    // Botón
    const btn = document.getElementById('themeToggle');
    if (btn) btn.addEventListener('click', () => window.toggleTheme());

    // Switch
    const sw = document.getElementById('themeSwitch');
    if (sw) sw.addEventListener('change', () => apply(sw.checked ? 'dark' : 'light'));

    // Seguir cambios del SO sólo si no hay preferencia guardada
    if (!localStorage.getItem(KEY)) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener?.('change', e => apply(e.matches ? 'dark' : 'light'));
    }
  });
})();
