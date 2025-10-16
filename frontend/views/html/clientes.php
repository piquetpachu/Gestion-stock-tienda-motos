<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Gestión de Clientes</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
  <link href="https://cdn.jsdelivr.net/npm/tom-select@2.3.1/dist/css/tom-select.bootstrap5.min.css" rel="stylesheet">
  <link rel="stylesheet" href="../css/style.css">
  <style>

    body { 
            display: none; /* Oculta toda la página inicialmente */
        }
        
  </style>
  
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
        <input type="text" id="busqueda" class="form-control" placeholder="🔍 Buscar por nombre, email o DNI..." />
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
            <th>Cuil-Cuit</th>
            <th>Fecha Alta</th>
            <th id="colAcciones" style="display: none;">Acciones</th>
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

  <!-- Modal Cliente -->
  <div class="modal fade" id="modalCliente" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <form id="formCliente" class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Cliente</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body row g-3">
          <input type="hidden" id="id_cliente" />

          <div class="col-md-6">
            <label for="nombre" class="form-label">Nombre</label>
            <input type="text" id="nombre" class="form-control" placeholder="Ej: Juan" required />
          </div>

          <div class="col-md-6">
            <label for="apellido" class="form-label">Apellido</label>
            <input type="text" id="apellido" class="form-control" placeholder="Ej: Pérez" required />
          </div>

          <div class="col-md-6">
            <label for="cuil_cuit" class="form-label">CUIL/CUIT</label>
            <input type="text" id="cuil_cuit" class="form-control" placeholder="Ej: 20123456789" maxlength="11" required />
          </div>

          <div class="col-md-6">
            <label for="email" class="form-label">Email</label>
            <input type="email" id="email" class="form-control" placeholder="Ej: juanperez@mail.com" required />
          </div>

          <div class="col-md-6">
            <label for="telefono" class="form-label">Teléfono</label>
            <input type="tel" id="telefono" class="form-control" placeholder="Ej: 3794000000" />
          </div>

          <div class="col-12">
            <label for="direccion" class="form-label">Dirección</label>
            <input type="text" id="direccion" class="form-control" placeholder="Ej: Av. San Martín 1234" />
          </div>
        </div>

        <div class="modal-footer">
          <button type="submit" class="btn btn-primary">Guardar</button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        </div>
      </form>
    </div>
  </div>
<!-- Modal Detalle de Cliente -->
<div class="modal fade" id="modalDetallesCliente" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header bg-primary text-white">
        <h5 class="modal-title" id="modalDetallesClienteLabel">Detalles del Cliente</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body" id="detalleCliente">
        <p class="text-muted text-center">Selecciona un cliente para ver sus datos completos.</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
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
    <script src="../js/clientes.js"></script>
</body>
</html>