<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Navbar con Modal Caja</title>
  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <!-- Iconos opcionales -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet">
</head>

<body>

  <!-- Navbar -->
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="dashboard.php">LOGO</a>

      <button class="navbar-toggler" type="button" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarContenido">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item"><a class="nav-link" href="productos.php">Gestión de Stock</a></li>
          <li class="nav-item"><a class="nav-link" href="clientes.php">Clientes</a></li>
          <li class="nav-item"><a class="nav-link" href="#">Estadísticas</a></li>
          <li class="nav-item" id="navUsuarios"><a class="nav-link" href="usuarios.php">Usuario</a></li>
          <li class="nav-item"><a class="nav-link" href="ventas.php">Ventas</a></li>
          <li class="nav-item"><a class="nav-link" href="historial.php">Historial</a></li>

          <!-- Dropdown Caja -->
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
              aria-expanded="false">
              Caja
            </a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#modalIngreso">Ingreso de dinero</a></li>
              <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#modalCierre">Cierre de caja</a></li>
            </ul>
          </li>
        </ul>

        <div class="d-flex align-items-center gap-2">
          <button id="btnTema" class="btn btn-sm btn-outline-light">🌙 Oscuro</button>
          <button id="logoutBtn" class="btn btn-danger">
            <i class="bi bi-box-arrow-right"></i> Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  </nav>

  <!-- Modal Ingreso -->
  <div class="modal fade" id="modalIngreso" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header bg-success text-white">
          <h5 class="modal-title">Ingreso de Dinero</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
            aria-label="Cerrar"></button>
        </div>
        <div class="modal-body">
          <form id="formIngreso">
            <div class="mb-3">
              <label for="montoIngreso" class="form-label">Monto</label>
              <input type="number" class="form-control" id="montoIngreso" required>
            </div>
            <div class="mb-3">
              <label for="detalleIngreso" class="form-label">Detalle</label>
              <textarea class="form-control" id="detalleIngreso"></textarea>
            </div>
            <button type="submit" class="btn btn-success">Guardar</button>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Cierre -->
  <div class="modal fade" id="modalCierre" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header bg-danger text-white">
          <h5 class="modal-title">Cierre de Caja</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
            aria-label="Cerrar"></button>
        </div>
        <div class="modal-body">
          <form id="formCierre">
            <div class="mb-3">
              <label for="montoCierre" class="form-label">Monto Final</label>
              <input type="number" class="form-control" id="montoCierre" required>
            </div>
            <div class="mb-3">
              <label for="detalleCierre" class="form-label">Observaciones</label>
              <textarea class="form-control" id="detalleCierre"></textarea>
            </div>
            <button type="submit" class="btn btn-danger">Registrar Cierre</button>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- Bootstrap JS bundle -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <!-- Tu JS de logout -->
  <script src="../js/logout.js"></script>

  <script>
    document.addEventListener('DOMContentLoaded', function() {
      // Toggle manual del navbar
      const btnToggle = document.querySelector('.navbar-toggler');
      const collapseEl = document.getElementById('navbarContenido');
      const bsCollapse = new bootstrap.Collapse(collapseEl, {
        toggle: false
      });

      btnToggle.addEventListener('click', function() {
        if (collapseEl.classList.contains('show')) {
          bsCollapse.hide();
        } else {
          bsCollapse.show();
        }
      });

      // Cerrar navbar al hacer click en un enlace del menú
      document.querySelectorAll('#navbarContenido .nav-link').forEach(link => {
        link.addEventListener('click', function() {
          if (collapseEl.classList.contains('show')) {
            bsCollapse.hide();
          }
        });
      });

      // Cerrar navbar al abrir un modal
      document.querySelectorAll('[data-bs-toggle="modal"]').forEach(trigger => {
        trigger.addEventListener('click', function() {
          if (collapseEl.classList.contains('show')) {
            bsCollapse.hide();
          }
        });
      });

      // Ocultar el enlace de usuarios si no es admin
      fetch('/Gestion-stock-tienda-motos/app/usuario-info')
        .then(res => res.ok ? res.json() : null)
        .then(user => {
          if (!user || user.rol !== 'admin') {
            document.getElementById('navUsuarios').style.display = 'none';
          }
        });
    });
  </script>

</body>

</html>