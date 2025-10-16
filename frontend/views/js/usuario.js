// Perfil de usuario: muestra datos del usuario autenticado
(function(){
  // Mostrar el body cuando estemos listos
  function showBody(){
    if (document.body) document.body.style.display = 'block';
  }

  function showAlert(tipo, mensaje){
    const alert = document.getElementById('perfil-alert');
    if (!alert) return;
    alert.className = `alert alert-${tipo}`;
    alert.textContent = mensaje;
    alert.classList.remove('d-none');
  }

  async function cargarPerfil(){
    try {
      // 1) Traer info básica de sesión
      const res = await fetch(`${API_URL}usuario-info`, { credentials: 'same-origin' });
      if (!res.ok) throw new Error('No autenticado');
      const user = await res.json();

      // 2) Pintar datos básicos
      document.getElementById('perfil-id').value = user.id ?? '';
      document.getElementById('perfil-rol').value = user.rol ?? '';

      // 3) Completar datos desde la API por id
      const res2 = await fetch(`${API_URL}usuario/${user.id}`, { credentials: 'same-origin' });
      if (!res2.ok) throw new Error('No se pudo obtener datos de usuario');
      const detalle = await res2.json();
      document.getElementById('perfil-nombre').value = detalle.nombre ?? '';
      document.getElementById('perfil-email').value = detalle.email ?? '';

      // 4) Mostrar contenido
  const contenido = document.getElementById('perfil-contenido');
  if (contenido) contenido.style.display = 'block';

    } catch (e) {
      showAlert('warning', 'No autenticado. Iniciá sesión para ver tu perfil.');
    } finally {
      showBody();
    }
  }

  document.addEventListener('DOMContentLoaded', cargarPerfil);
})();
