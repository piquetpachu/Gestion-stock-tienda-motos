document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const btnTema = document.getElementById("btnTema");

  // Mostrar body si estaba oculto
  if (document.body && getComputedStyle(document.body).display === 'none') {
    document.body.style.display = 'block';
  }

  // Estado inicial por localStorage o atributo
  const preferencia = localStorage.getItem('appTheme'); // 'dark' | 'light'
  const attr = root.getAttribute('data-app-theme');
  const inicial = preferencia || attr || 'light';
  root.setAttribute('data-app-theme', inicial);

  // Configurar botón si existe
  function renderBtn(theme) {
    if (!btnTema) return;
    if (theme === 'dark') {
      btnTema.textContent = '☀️ Claro';
      btnTema.classList.remove('btn-outline-light');
      btnTema.classList.add('btn-outline-warning');
    } else {
      btnTema.textContent = '🌙 Oscuro';
      btnTema.classList.remove('btn-outline-warning');
      btnTema.classList.add('btn-outline-light');
    }
  }
  renderBtn(inicial);

  if (btnTema) {
    btnTema.addEventListener('click', () => {
      const actual = root.getAttribute('data-app-theme') === 'dark' ? 'dark' : 'light';
      const nuevo = actual === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-app-theme', nuevo);
      localStorage.setItem('appTheme', nuevo);
      renderBtn(nuevo);
    });
  }
});
