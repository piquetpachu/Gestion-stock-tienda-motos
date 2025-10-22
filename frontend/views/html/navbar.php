<!-- Parcial: Navbar (sin HTML/HEAD/BODY) -->
<style>
  .brand-logo { height: 32px; width: auto; object-fit: contain; }
  .navbar .navbar-toggler { border: 1px solid rgba(255,255,255,.4); }
  .navbar .navbar-toggler:focus { box-shadow: none; }
  /* Unificar tamaño de íconos en la navbar */
  .navbar .nav-link svg { width: 18px; height: 18px; flex-shrink: 0; }
  .navbar .nav-link { line-height: 1; }
</style>

<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <div class="container-fluid">
    <a class="navbar-brand d-flex align-items-center gap-2" href="dashboard.php">
      <img src="/Gestion-stock-tienda-motos/public/img/logo-motos-carri.png" alt="Motos Carri" class="brand-logo" />
      <span class="d-none d-sm-inline"></span>
    </a>

      <button class="navbar-toggler" type="button" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

    <div class="collapse navbar-collapse" id="navbarContenido">
  <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link d-flex align-items-center gap-2" href="productos.php">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box2-fill" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path d="M3.75 0a1 1 0 0 0-.8.4L.1 4.2a.5.5 0 0 0-.1.3V15a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V4.5a.5.5 0 0 0-.1-.3L13.05.4a1 1 0 0 0-.8-.4zM15 4.667V5H1v-.333L1.5 4h6V1h1v3h6z"/>
            </svg>
            Gestión de Stock
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link d-flex align-items-center gap-2" href="clientes.php">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
            </svg>
            Clientes
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link d-flex align-items-center gap-2" href="AdmRubros.php">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-briefcase-fill" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v1.384l7.614 2.03a1.5 1.5 0 0 0 .772 0L16 5.884V4.5A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5"/>
              <path d="M0 12.5A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5V6.85L8.129 8.947a.5.5 0 0 1-.258 0L0 6.85z"/>
            </svg>
            Rubros
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link d-flex align-items-center gap-2" href="AdmProveedores.php">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-people-fill" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/>
            </svg>
            Proveedores
          </a>
        </li>
        <li class="nav-item">
          <a id="navUsuarios" class="nav-link d-flex align-items-center gap-2" href="usuarios.php" style="display:none;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-person-fill" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0m2 5.755V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-.245S4 12 8 12s5 1.755 5 1.755"/>
            </svg>
            Usuario
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link d-flex align-items-center gap-2" href="ventas.php">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-wallet2" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5z"/>
            </svg>
            Ventas
          </a>
        </li>

          <!-- Dropdown Caja -->
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle d-flex align-items-center gap-1" href="#" role="button" data-bs-toggle="dropdown"
              aria-expanded="false">
              Caja
            </a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#modalIngreso">Ingreso de dinero</a></li>
              <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#modalCierre">Cierre de caja</a></li>
            </ul>
          </li>
        </ul>

        <div class="d-flex align-items-center gap-2 ms-3">
          <div class="form-check form-switch m-0 text-white d-flex align-items-center">
            <input class="form-check-input" type="checkbox" id="switchTema" role="switch" aria-label="Cambiar tema">
          </div>
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

  <!-- JS de logout (se asume Bootstrap ya cargado por la vista contenedora) -->
  <script src="../js/logout.js"></script>

  <script>
    document.addEventListener('DOMContentLoaded', function () {
      // Toggle manual del navbar
      const btnToggle = document.querySelector('.navbar-toggler');
      const collapseEl = document.getElementById('navbarContenido');
      if (btnToggle && collapseEl && window.bootstrap?.Collapse) {
        const bsCollapse = new bootstrap.Collapse(collapseEl, { toggle: false });
        btnToggle.addEventListener('click', function () {
          if (collapseEl.classList.contains('show')) {
            bsCollapse.hide();
          } else {
            bsCollapse.show();
          }
        });
      }

      // Cerrar navbar al hacer click en un enlace del menú
      document.querySelectorAll('#navbarContenido .nav-link').forEach(link => {
        link.addEventListener('click', function () {
          if (collapseEl.classList.contains('show')) {
            bsCollapse.hide();
          }
        });
      });

      // Cerrar navbar al abrir un modal
      document.querySelectorAll('[data-bs-toggle="modal"]').forEach(trigger => {
        trigger.addEventListener('click', function () {
          if (collapseEl.classList.contains('show')) {
            bsCollapse.hide();
          }
        });
      });

      // Ocultar el enlace de usuarios si no es admin
      fetch('/Gestion-stock-tienda-motos/app/usuario-info', { credentials: 'same-origin' })
        .then(res => res.ok ? res.json() : null)
        .then(user => {
          const navUsers = document.getElementById('navUsuarios');
          if (!navUsers) return; // nada que ocultar
          if (user && user.rol === 'admin') navUsers.style.display = '';
        })
        .catch(() => {});
    });
  </script>
