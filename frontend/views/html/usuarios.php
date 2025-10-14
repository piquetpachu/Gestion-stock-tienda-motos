<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Panel de Usuarios</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
  <link rel="stylesheet" href="../css/style.css">
  <style>
    body.dark-theme {
      background-color: #181818;
      color: #eee;
    }
    body.dark-theme .table-dark {
      background-color: #222;
      color: #fff;
    }
    body.dark-theme .card, body.dark-theme .modal-content {
      background-color: #222;
      color: #fff;
    }
    body.dark-theme .btn {
      background-color: #222;
      color: #fff;
      border-color: #444;
    }
    body.dark-theme .btn-warning {
      background-color: #444;
      color: #ffd700;
    }
    body.dark-theme .btn-danger {
      background-color: #880000;
      color: #fff;
    }
  </style>
</head>
<body>
  <?php include 'navbar.php'; ?>
  <div class="container mt-5" id="usuarios-panel">
    <h1>👤 Panel de Control de Usuarios</h1>
    <div id="admin-alert" class="alert alert-danger d-none" role="alert"></div>
    <div class="row g-2 align-items-end mb-3">
      <div class="col-md-6">
        <label for="busquedaUsuario" class="form-label">Buscar</label>
        <input type="text" id="busquedaUsuario" class="form-control" placeholder="Buscar por nombre, email o rol..." />
      </div>
      <div class="col-md-4">
        <label for="ordenarUsuario" class="form-label">Ordenar por</label>
        <select id="ordenarUsuario" class="form-select">
          <option value="">Sin orden</option>
          <option value="nombre">Nombre</option>
          <option value="email">Email</option>
          <option value="rol">Rol</option>
        </select>
      </div>
      <div class="col-md-2 text-end">
        <button class="btn btn-success w-100" id="btnAgregarUsuario">➕ Registrar Usuario</button>
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
