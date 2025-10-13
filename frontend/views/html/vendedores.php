<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Gestor de Vendedores</title>
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="../css/style.css" />
  </head>
  <body style="display: none">
    <?php include 'navbar.php'; ?>
    <div class="container mt-5" id="vendedores-panel">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h1>👥 Gestor de Vendedores</h1>
        <button class="btn btn-success" id="btnAgregarVendedor">
          ➕ Registrar Vendedor
        </button>
      </div>
      <div id="vendedores-alert" class="alert alert-danger d-none" role="alert"></div>
      <div class="table-responsive">
        <table class="table table-striped table-hover table-bordered align-middle">
          <thead class="table-dark">
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody id="tbodyVendedores">
            <tr>
              <td colspan="3" class="text-center">Cargando...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Vendedor -->
    <div class="modal fade" id="modalVendedor" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <form id="formVendedor" class="modal-content" autocomplete="off">
          <div class="modal-header">
            <h5 class="modal-title">Vendedor</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <input type="hidden" id="vend_id" />
            <div class="mb-3">
              <label for="vend_nombre" class="form-label">Nombre</label>
              <input type="text" id="vend_nombre" class="form-control" required />
            </div>
            <div class="mb-3">
              <label for="vend_email" class="form-label">Email</label>
              <input type="email" id="vend_email" class="form-control" required />
            </div>
            <div class="mb-3">
              <label for="vend_contrasena" class="form-label">Contraseña</label>
              <input
                type="password"
                id="vend_contrasena"
                class="form-control"
                placeholder="(dejar vacío para no cambiar)"
              />
            </div>
            <div class="alert alert-info" id="vend_info" style="display: none"></div>
          </div>
          <div class="modal-footer">
            <button type="submit" class="btn btn-primary">Guardar</button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>

    <script src="../js/theme.js"></script>
    <script src="../js/config.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="../js/vendedores.js"></script>
    <script>
      // Mostrar el body solo si es admin
      document.addEventListener('DOMContentLoaded', async function () {
        try {
          const res = await fetch(API_URL + 'usuario-info', { credentials: 'same-origin' });
          if (!res.ok) throw new Error('No autenticado');
          const user = await res.json();
          if (user.rol !== 'admin') {
            document.getElementById('vendedores-panel').style.display = 'none';
            const alert = document.getElementById('vendedores-alert');
            alert.textContent = 'Acceso solo para administradores.';
            alert.classList.remove('d-none');
            document.body.style.display = '';
          } else {
            document.body.style.display = '';
          }
        } catch {
          window.location.href = 'login.html';
        }
      });
    </script>
  </body>
  </html>
