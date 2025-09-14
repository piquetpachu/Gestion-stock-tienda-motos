// Protege el acceso al dashboard: verifica autenticación
fetch('http://localhost/Gestion-stock-tienda-motos/app/usuario-info')
  .then(response => {
    if (response.status === 401 || !response.ok) { // Si no está autenticado o hay error
      throw new Error('No autenticado'); // Forzar el catch
    }
    return response.json();
  })
  .then(data => {
    if (!data?.id) { // Optional chaining por si data es undefined
      throw new Error('Usuario no válido');
    }
    document.body.style.display = 'block';

    // Si todo está bien, continúa cargando el dashboard
  })
  .catch(() => {
    alert('Debes iniciar sesión para acceder al panel.');
    window.location.href = 'login.html';
  });