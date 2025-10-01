<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Navbar con Modal Caja</title>
  <link href="https://unpkg.com/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <script src="https://unpkg.com/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <style>
    .brand-logo { height: 32px; width: auto; object-fit: contain; }
  </style>
</head>

<body>

<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <div class="container-fluid">
    <a class="navbar-brand d-flex align-items-center gap-2" href="dashboard.php">
      <img src="/Gestion-stock-tienda-motos/public/img/logo-motos-carri.png" alt="Motos Carri" class="brand-logo" />
      <span class="d-none d-sm-inline"></span>
    </a>

    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContenido" aria-controls="navbarContenido" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarContenido">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item"><a class="nav-link" href="productos.php">Gestión de Stock</a></li>
        <li class="nav-item"><a class="nav-link" href="clientes.php">Clientes</a></li>
        <li class="nav-item"><a class="nav-link" href="AdmRubros.php">Rubros</a></li>
        <li class="nav-item"><a class="nav-link" href="AdmProveedores.php">Proveedores</a></li>
        <li class="nav-item"><a class="nav-link" href="#">Usuario</a></li>
        <li class="nav-item"><a class="nav-link" href="ventas.php">Ventas</a></li>

        <!-- Dropdown Caja -->
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Caja
          </a>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#modalIngreso">Ingreso de dinero</a></li>
            <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#modalCierre">Cierre de caja</a></li>
          </ul>
        </li>
      </ul>

      <div class="d-flex align-items-center gap-2">
        <button id="themeToggle" class="btn btn-sm btn-outline-light" type="button">🌙 Oscuro</button>
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
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
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
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
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

</body>
</html>
