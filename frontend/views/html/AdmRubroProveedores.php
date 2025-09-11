<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Administrar Rubros</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="../css/style.css">
</head>
<body class="bg-dark text-light">
  <?php include 'navbar.php'; ?>
  <div class="container mt-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h3 m-0">📂 Rubros</h1>
      <button id="btnNuevo" class="btn btn-success d-none">➕ Nuevo Rubro</button>
    </div>

    <!-- Formulario (modal) -->
    <div class="modal fade" id="modalRubro" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <form id="formRubro" class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="tituloModal">Nuevo Rubro</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <input type="hidden" id="id_rubro">
            <div class="mb-3">
              <label class="form-label">Nombre</label>
              <input type="text" id="nombre" class="form-control" required>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" type="submit" id="btnGuardar">Guardar</button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Tabla -->
    <div class="table-responsive">
      <table class="table table-striped table-bordered align-middle table-dark">
        <thead>
          <tr>
            <th style="width:80px">ID</th>
            <th>Nombre</th>
            <th id="thAcciones" style="width:160px; display:none;">Acciones</th>
          </tr>
        </thead>
        <tbody id="tbodyRubros">
          <tr><td colspan="3" class="text-center">Cargando...</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <script src="../js/config.js"></script>
  <script src="../js/dashboard-proteccion.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script src="../js/AdmRubroProveedores.js"></script>
</body>
</html>