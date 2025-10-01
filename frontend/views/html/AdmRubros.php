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

  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="h5 m-0">📂 Rubros</h2>
      <button id="btnNuevoRubro" class="btn btn-success btn-sm d-none">➕ Nuevo</button>
    </div>
    <div class="table-responsive">
      <table class="table table-striped table-bordered align-middle table-dark mb-0">
        <thead>
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
  </div>

  <!-- Modal Rubro -->
  <div class="modal fade" id="modalRubro" tabindex="-1" aria-hidden="true" aria-labelledby="tituloModalRubro" role="dialog" aria-modal="true">
    <div class="modal-dialog">
      <form id="formRubro" class="modal-content bg-white text-dark" autocomplete="off">
        <div class="modal-header">
          <h5 class="modal-title text-dark" id="tituloModalRubro">Nuevo Rubro</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
        </div>
        <div class="modal-body">
          <input type="hidden" id="id_rubro" name="id_rubro">
          <div class="mb-3">
            <label class="form-label text-dark" for="nombre_rubro">Nombre</label>
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

  <script src="../js/config.js"></script>
  <script src="../js/dashboard-proteccion.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script src="../js/AdmRubros.js"></script>
</body>
</html>