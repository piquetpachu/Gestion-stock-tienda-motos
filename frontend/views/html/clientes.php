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
      <h1>👥 Gestión de Clientes</h1>
      <button class="btn btn-success" onclick="nuevoCliente()" id="btnAgregarCliente" style="display: none;">➕ Agregar Cliente</button>
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
            <th>Dirección</th>
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
            <input type="text" id="nombre" class="form-control" placeholder="Nombre" required />
          </div>
          <div class="col-md-6">
            <input type="text" id="apellido" class="form-control" placeholder="Apellido" required />
          </div>
          <div class="col-md-6">
            <input type="text" id="cuil_cuit" class="form-control" placeholder="CUIL/CUIT"  maxlength="11"/>
          </div>
          <div class="col-md-6">
            <input type="email" id="email" class="form-control" placeholder="Email" required />
          </div>
          <div class="col-md-6">
            <input type="tel" id="telefono" class="form-control" placeholder="Teléfono" />
          </div>
          <div class="col-12">
            <input type="text" id="direccion" class="form-control" placeholder="Dirección" />
          </div>
        </div>
        <div class="modal-footer">
          <button type="submit" class="btn btn-primary">Guardar</button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        </div>
      </form>
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