<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Panel de Usuarios</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
  <link rel="stylesheet" href="../css/style.css">
</head>
<body>
  <?php include 'navbar.php'; ?>
  <div class="container page-container" id="usuarios-panel">
    <div class="page-card">
    <h1>
      <svg xmlns="http://www.w3.org/2000/svg" class="title-icon" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0m2 5.755V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-.245S4 12 8 12s5 1.755 5 1.755"/>
      </svg>
      Panel de Control de Usuarios
    </h1>
    <div id="admin-alert" class="alert alert-danger d-none" role="alert"></div>
    <div class="row g-2 align-items-end mb-3">
      <div class="col-md-6">
        <label for="busquedaUsuario" class="form-label"></label>
        <input type="text" id="busquedaUsuario" class="form-control" placeholder="Buscar por nombre, email o rol..." />
      </div>
      <div class="col-md-4">
        <label for="ordenarUsuario" class="form-label"></label>
        <select id="ordenarUsuario" class="form-select">
          <option value="">Sin orden</option>
          <option value="nombre">Nombre</option>
          <option value="email">Email</option>
          <option value="rol">Rol</option>
        </select>
      </div>
      <div class="col-md-2 text-end">
        <button class="btn btn-success d-inline-flex align-items-center gap-1" id="btnAgregarUsuario">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
          </svg>
          Agregar Usuario
        </button>
      </div>
    </div>
    <div class="table-responsive">
      <table class="table table-striped table-hover table-bordered align-middle">
        <thead class="table-dark">
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody id="tablaUsuarios"></tbody>
      </table>
    </div>
    </div>
  </div>

  <!-- Modal Usuario -->
  <div class="modal fade" id="modalUsuario" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <form id="formUsuario" class="modal-content" autocomplete="off">
        <div class="modal-header">
          <h5 class="modal-title">Usuario</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <input type="hidden" id="usuario_id" />
          <div class="mb-3">
            <label for="usuario_nombre" class="form-label">Nombre</label>
            <input type="text" id="usuario_nombre" class="form-control" required />
          </div>
          <div class="mb-3">
            <label for="usuario_email" class="form-label">Email</label>
            <input type="email" id="usuario_email" class="form-control" required />
          </div>
          <div class="mb-3">
            <label for="usuario_rol" class="form-label">Rol</label>
            <select id="usuario_rol" class="form-select">
              <option value="admin">Admin</option>
              <option value="vendedor">Vendedor</option>
            </select>
          </div>
          <div class="mb-3">
            <label for="usuario_contrasena" class="form-label">Contraseña</label>
            <input type="password" id="usuario_contrasena" class="form-control" />
          </div>
        </div>
        <div class="modal-footer">
          <button type="submit" class="btn btn-primary">Guardar</button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        </div>
      </form>
    </div>
  </div>

  <script src="../js/theme.js"></script>
  <script src="../js/config.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script src="../js/usuarios.js"></script>
  <script>
    // Controlar acceso: mostrar/ocultar panel pero nunca ocultar el body
    document.addEventListener('DOMContentLoaded', async function() {
      try {
        const res = await fetch(`${API_URL}usuario-info`, { credentials: 'same-origin' });
        if (!res.ok) throw new Error('No autenticado');
        const user = await res.json();
        if (user.rol !== 'admin') {
          document.getElementById('usuarios-panel').style.display = 'none';
          document.getElementById('admin-alert').textContent = 'Acceso solo para administradores.';
          document.getElementById('admin-alert').classList.remove('d-none');
        } else {
          // admin: el JS usuarios.js se encargará de cargar la tabla
        }
      } catch (e) {
        const panel = document.getElementById('usuarios-panel');
        if (panel) panel.style.display = 'none';
        const alert = document.getElementById('admin-alert');
        if (alert) {
          alert.textContent = 'No autenticado. Inicie sesión para continuar.';
          alert.classList.remove('d-none');
        }
      }
    });
  </script>
</body>
</html>
