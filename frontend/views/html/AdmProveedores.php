<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Administrar Proveedores</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="../css/style.css">
</head>
<body class="bg-dark text-light">
  <?php include 'navbar.php'; ?>

  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="h5 m-0">🏭 Proveedores</h2>
      <button id="btnNuevoProveedor" class="btn btn-success btn-sm d-none">➕ Nuevo</button>
    </div>

    <!-- Buscador -->
    <div class="mb-2">
      <input type="search" id="buscarProveedor" class="form-control form-control-sm" placeholder="Buscar por nombre o CUIT">
    </div>

    <div class="table-responsive">
      <table class="table table-striped table-bordered align-middle table-dark mb-0">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>CUIT</th>
            <th id="thAccionesProveedores" style="width:160px; display:none;">Acciones</th>
          </tr>
        </thead>
        <tbody id="tbodyProveedores">
          <tr><td colspan="3" class="text-center">Cargando...</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Modal Proveedor -->
  <div class="modal fade" id="modalProveedor" tabindex="-1" aria-hidden="true" aria-labelledby="tituloModalProveedor" role="dialog" aria-modal="true">
    <div class="modal-dialog modal-lg">
      <form id="formProveedor" class="modal-content bg-white text-dark" autocomplete="off">
        <div class="modal-header">
          <h5 class="modal-title text-dark" id="tituloModalProveedor">Nuevo Proveedor</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
        </div>
        <div class="modal-body row g-3">
          <input type="hidden" id="id_proveedor" name="id_proveedor">
          <div class="col-md-6">
            <label class="form-label text-dark" for="prov_nombre">Nombre</label>
            <input type="text" id="prov_nombre" name="nombre" class="form-control" required maxlength="100">
          </div>
          <div class="col-md-6">
            <label class="form-label text-dark" for="prov_cuit">CUIT</label>
            <input type="text" id="prov_cuit" name="cuit" class="form-control" maxlength="20">
          </div>
          <div class="col-md-6">
            <label class="form-label text-dark" for="prov_telefono">Teléfono</label>
            <input type="text" id="prov_telefono" name="telefono" class="form-control" maxlength="20">
          </div>
          <div class="col-md-6">
            <label class="form-label text-dark" for="prov_email">Email</label>
            <input type="email" id="prov_email" name="email" class="form-control" maxlength="100">
          </div>
          <div class="col-12">
            <label class="form-label text-dark" for="prov_direccion">Dirección</label>
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

  <script src="../js/config.js"></script>
  <script src="../js/dashboard-proteccion.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script src="../js/AdmProveedores.js"></script>
</body>
</html>