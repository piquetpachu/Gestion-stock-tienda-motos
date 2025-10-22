<!DOCTYPE html>
<html lang="es" data-bs-theme="light">
<head>
  <meta charset="UTF-8">
  <title>Gestión de Rubros</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="../css/style.css">
</head>
<body>
  <?php include 'navbar.php'; ?>
  
  <div class="container page-container">
    <div class="page-card">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>
        <svg xmlns="http://www.w3.org/2000/svg" class="title-icon" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v1.384l7.614 2.03a1.5 1.5 0 0 0 .772 0L16 5.884V4.5A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5"/>
          <path d="M0 12.5A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5V6.85L8.129 8.947a.5.5 0 0 1-.258 0L0 6.85z"/>
        </svg>
        Gestión de Rubros
      </h1>
      <button id="btnNuevoRubro" class="btn btn-success d-none d-inline-flex align-items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
        </svg>
        Agregar Rubro
      </button>
    </div>

    <!-- Filtros -->
    <div class="row mb-3">
      <div class="col-md-6">
        <input type="search" id="buscarRubro" class="form-control" placeholder="Buscar rubro por nombre">
      </div>
      <div class="col-md-6">
        <select id="ordenarPorRubro" class="form-select">
          <option value="nombre_asc">Ordenar: Nombre (A-Z)</option>
          <option value="nombre_desc">Nombre (Z-A)</option>
        </select>
      </div>
    </div>

    <!-- Tabla -->
    <div class="table-responsive">
      <table class="table table-striped table-hover table-bordered align-middle">
        <thead class="table-dark">
          <tr>
            <th>Nombre</th>
            <th id="thAccionesRubros" class="acciones-col" style="display:none;">Acciones</th>
          </tr>
        </thead>
        <tbody id="tbodyRubros">
          <tr><td colspan="2" class="text-center">Cargando...</td></tr>
        </tbody>
      </table>
    </div>

    <!-- Paginación -->
    <nav>
      <ul class="pagination justify-content-center" id="paginacionRubros"></ul>
    </nav>
    </div>
  </div>

  <!-- Modal Rubro -->
  <div class="modal fade" id="modalRubro" tabindex="-1" aria-hidden="true" aria-labelledby="tituloModalRubro" role="dialog" aria-modal="true">
    <div class="modal-dialog">
      <form id="formRubro" class="modal-content" autocomplete="off">
        <div class="modal-header">
          <h5 class="modal-title" id="tituloModalRubro">Nuevo Rubro</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
        </div>
        <div class="modal-body">
          <input type="hidden" id="id_rubro" name="id_rubro">
          <div class="mb-3">
            <label class="form-label" for="nombre_rubro">Nombre</label>
            <input type="text" id="nombre_rubro" name="nombre" class="form-control" required maxlength="100">
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" type="submit">Guardar</button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal Productos por Rubro -->
  <div class="modal fade" id="modalProductosRubro" tabindex="-1" aria-hidden="true" aria-labelledby="tituloProductosRubro" role="dialog" aria-modal="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="tituloProductosRubro">Productos del Rubro</h5>
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
              <tbody id="tbodyProdPorRubro">
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

  <script src="../js/theme.js"></script>
  <script src="../js/config.js"></script>
  <script src="../js/dashboard-proteccion.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script src="../js/AdmRubros.js?v=20251022"></script>
</body>
</html>