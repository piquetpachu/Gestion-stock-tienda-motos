<!DOCTYPE html>
<html lang="es" data-bs-theme="light">
<head>
  <meta charset="UTF-8">
  <title>Gestión de Rubros</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <script>
    (function(){
      var t = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      document.documentElement.setAttribute('data-bs-theme', t);
    })();
  </script>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="../css/style.css">
</head>
<body>
  <?php include 'navbar.php'; ?>
  
  <div class="container mt-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>📂 Gestión de Rubros</h1>
      <button id="btnNuevoRubro" class="btn btn-success d-none">➕ Nuevo Rubro</button>
    </div>

    <!-- Filtros -->
    <div class="row mb-3">
      <div class="col-md-6 mb-2 mb-md-0">
        <input type="search" id="buscarRubro" class="form-control" placeholder="🔍 Buscar rubro por nombre">
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
            <th id="thAccionesRubros" style="width:160px; display:none;">Acciones</th>
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

  <script src="../js/theme.js"></script>
  <script src="../js/config.js"></script>
  <script src="../js/dashboard-proteccion.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script src="../js/AdmRubros.js"></script>
</body>
</html>