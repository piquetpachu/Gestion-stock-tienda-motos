<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Gestión de Clientes</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
  <link href="https://cdn.jsdelivr.net/npm/tom-select@2.3.1/dist/css/tom-select.bootstrap5.min.css" rel="stylesheet">
  <link rel="stylesheet" href="../css/style.css">
</head>
<body>
  <?php include 'navbar.php'; ?>

  <div class="container page-container">
    <div class="page-card">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 id="titulo-clientes" class="d-flex align-items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="title-icon" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
        </svg>
        Gestión de Clientes
      </h1>
      <button class="btn btn-success d-flex align-items-center gap-1" onclick="nuevoCliente()" id="btnAgregarCliente" style="display: none;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/></svg>
        Agregar Cliente
      </button>
    </div>

    <!-- Filtros -->
    <div class="row mb-3">
      <div class="col-md-6">
  <input type="text" id="busqueda" class="form-control" placeholder="Buscar por nombre, email o DNI..." />
      </div>
      <div class="col-md-6">
        <select id="ordenarPor" class="form-select">
          <option value="nombre">Ordenar por: Nombre</option>
          <option value="fecha_alta">Fecha Alta</option>
          <option value="cuil_cuit">Cuil-Cuit</option>
        </select>
      </div>
    </div>

    <!-- Tabla -->
    <div class="table-responsive">
      <table class="table table-striped table-hover table-bordered align-middle">
        <thead class="table-dark">
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Cuil-Cuit</th>
            <th>Fecha Alta</th>
            <th id="colAcciones" class="acciones-col" style="display: none;">Acciones</th>
            <!-- <th>Acciones</th> -->
          </tr>
        </thead>
        <tbody id="tablaClientes"></tbody>
      </table>
    </div>

    <!-- Paginación -->
    <nav>
      <ul class="pagination justify-content-center" id="paginacion"></ul>
    </nav>
    </div>
  </div>

  <!-- Modal Cliente (alineado con Ventas) -->
  <div class="modal fade" id="modalCliente" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Agregar Cliente</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <form id="form_cliente">
            <input type="hidden" id="id_cliente" />
            <div class="mb-2"><label class="form-label">Nombre</label><input type="text" class="form-control" id="cliente_nombre" required></div>
            <div class="mb-2"><label class="form-label">Apellido</label><input type="text" class="form-control" id="cliente_apellido"></div>
            <div class="mb-2"><label class="form-label">CUIT/CUIL</label><input type="text" class="form-control" id="cliente_cuit" required></div>
            <div class="mb-2"><label class="form-label">Email</label><input type="email" class="form-control" id="cliente_email" required></div>
            <div class="mb-2"><label class="form-label">Teléfono</label><input type="text" class="form-control" id="cliente_telefono" maxlength="15" inputmode="numeric" pattern="\d+"></div>
            <div class="mb-2"><label class="form-label">Dirección</label><input type="text" class="form-control" id="cliente_direccion"></div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
          <button class="btn btn-primary" id="guardar_cliente">Guardar</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Scripts -->
  <script src="../js/theme.js"></script>
  <script src="../js/config.js"></script>
  <script src="../js/dashboard-proteccion.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/tom-select@2.3.1/dist/js/tom-select.complete.min.js"></script>
  <script src="../js/clientes.js?v=20251022-02"></script>
</body>
</html>