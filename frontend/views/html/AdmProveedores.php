<!DOCTYPE html>
<html lang="es" data-bs-theme="light">
<head>
  <meta charset="UTF-8">
  <title>Gestión de Proveedores</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="../css/style.css">
</head>
<body>
  <?php include 'navbar.php'; ?>

  <div class="container page-container">
    <div class="page-card">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>🏭 Gestión de Proveedores</h1>
      <button id="btnNuevoProveedor" class="btn btn-success d-none">➕ Nuevo Proveedor</button>
    </div>

    <!-- Filtros -->
    <div class="row mb-3">
      <div class="col-md-6 mb-2 mb-md-0">
        <input type="search" id="buscarProveedor" class="form-control" placeholder="🔍 Buscar por Nombre, CUIT, Teléfono, Email o Dirección">
      </div>
      <div class="col-md-6">
        <select id="ordenarPorProveedor" class="form-select">
          <option value="nombre_asc">Ordenar: Nombre (A-Z)</option>
          <option value="nombre_desc">Nombre (Z-A)</option>
          <option value="cuit_asc">CUIT (0-9)</option>
          <option value="cuit_desc">CUIT (9-0)</option>
        </select>
      </div>
    </div>

    <!-- Tabla -->
    <div class="table-responsive">
      <table class="table table-striped table-hover table-bordered align-middle">
        <thead class="table-dark">
          <tr>
            <th>Nombre</th>
            <th>CUIT</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Dirección</th>
            <th id="thAccionesProveedores" style="width:160px; display:none;">Acciones</th>
          </tr>
        </thead>
        <tbody id="tbodyProveedores">
          <tr><td colspan="5" class="text-center">Cargando...</td></tr>
        </tbody>
      </table>
    </div>

    <!-- Paginación -->
    <nav>
      <ul class="pagination justify-content-center" id="paginacionProveedores"></ul>
    </nav>
    </div>
  </div>

  <!-- Modal Productos del Proveedor -->
  <div class="modal fade" id="modalProductosProveedor" tabindex="-1" aria-hidden="true" aria-labelledby="tituloModalProductosProveedor" role="dialog" aria-modal="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="tituloModalProductosProveedor">Productos del Proveedor</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
        </div>
        <div class="modal-body">
          <div class="table-responsive">
            <table class="table table-sm table-striped align-middle">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Precio Venta</th>
                  <th>Stock</th>
                  <th>Código Barras</th>
                </tr>
              </thead>
              <tbody id="tbodyProdPorProveedor">
                <tr><td colspan="5" class="text-center text-secondary">Sin productos</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Proveedor -->
  <div class="modal fade" id="modalProveedor" tabindex="-1" aria-hidden="true" aria-labelledby="tituloModalProveedor" role="dialog" aria-modal="true">
    <div class="modal-dialog modal-lg">
      <form id="formProveedor" class="modal-content" autocomplete="off">
        <div class="modal-header">
          <h5 class="modal-title" id="tituloModalProveedor">Nuevo Proveedor</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
        </div>
        <div class="modal-body row g-3">
          <input type="hidden" id="id_proveedor" name="id_proveedor">
          <div class="col-md-6">
            <label class="form-label" for="prov_nombre">Nombre</label>
            <input type="text" id="prov_nombre" name="nombre" class="form-control" required maxlength="100">
          </div>
          <div class="col-md-6">
            <label class="form-label" for="prov_cuit">CUIT</label>
            <input type="text" id="prov_cuit" name="cuit" class="form-control" maxlength="20">
          </div>
          <div class="col-md-6">
            <label class="form-label" for="prov_telefono">Teléfono</label>
            <input type="text" id="prov_telefono" name="telefono" class="form-control" maxlength="20">
          </div>
          <div class="col-md-6">
            <label class="form-label" for="prov_email">Email</label>
            <input type="email" id="prov_email" name="email" class="form-control" maxlength="100">
          </div>
          <div class="col-12">
            <label class="form-label" for="prov_direccion">Dirección</label>
            <input type="text" id="prov_direccion" name="direccion" class="form-control" maxlength="255">
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" type="submit">Guardar</button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        </div>
      </form>
    </div>
  </div>


  <script src="../js/theme.js"></script>
  <script src="../js/config.js"></script>
  <script src="../js/dashboard-proteccion.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script src="../js/AdmProveedores.js"></script>
</body>
</html>