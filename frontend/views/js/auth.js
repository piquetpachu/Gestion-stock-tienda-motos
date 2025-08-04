// const API_URL = 'http://localhost/Gestion-stock-tienda-motos/app/';

// async function verificarSesion(rolesPermitidos = []) {
//   try {
//     const res = await fetch(API_URL + 'usuario-info');
//     const data = await res.json();

//     if (data.error || !data.rol) {
//       window.location.href = 'login.html';
//       return;
//     }

//     if (!rolesPermitidos.includes(data.rol)) {
//   const toast = new bootstrap.Toast(document.getElementById('toastPermiso'));
//   toast.show();

//   // Redirigir después de unos segundos (por ejemplo, 2.5 segundos)
//   setTimeout(() => {
//     window.location.href = window.history.back(); // o back()
//   }, 2500);
//   return;

//     }

//     // Si todo bien, mostrar el contenido
//     document.body.style.display = 'block';

//   } catch (error) {
//     console.error('Error al verificar sesión:', error);
//     window.location.href = 'login.html';
//   }
// }
