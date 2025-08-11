<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Gestión de Clientes</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
<?php include 'navbar.php'; ?>
<div class="container my-4">
  <div class="row g-4">
    <!-- Columna Formulario -->
    <div class="col-lg-6">
      <div class="card mb-4">
        <div class="card-header fw-bold">Formulario de Cliente</div>
        <div class="card-body">
          <form>
            <div class="mb-3">
              <label class="form-label">Nombre</label>
              <input type="text" class="form-control">
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input type="email" class="form-control">
            </div>
            <div class="mb-3">
              <label class="form-label">Teléfono</label>
              <input type="text" class="form-control">
            </div>
            <div class="mb-3">
              <label class="form-label">Dirección</label>
              <input type="text" class="form-control">
            </div>
            <div class="d-flex justify-content-end gap-2">
              <button type="button" class="btn btn-success">Guardar</button>
              <button type="button" class="btn btn-secondary">Limpiar</button>
            </div>
          </form>
        </div>
      </div>

      <div class="card">
        <div class="card-header fw-bold">Registrar Compra</div>
        <div class="card-body">
          <form>
            <div class="mb-3">
              <label class="form-label">Cliente</label>
              <select class="form-select"></select>
            </div>
            <div class="mb-3">
              <label class="form-label">Producto</label>
              <input class="form-control">
            </div>
            <div class="mb-3">
              <label class="form-label">Monto (ARS)</label>
              <input type="number" step="0.01" class="form-control">
            </div>
            <div class="d-flex justify-content-end">
              <button class="btn btn-primary" type="button">Registrar Compra</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Columna Listas -->
    <div class="col-lg-6">
      <div class="card mb-4">
        <div class="card-header fw-bold">Lista de Clientes</div>
        <div class="card-body table-responsive">
          <table class="table table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th>Nombre</th>
                <th>Contacto</th>
                <th class="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ejemplo Nombre</td>
                <td>Email<br>Teléfono<br>Dirección</td>
                <td class="text-center">
                  <button class="btn btn-sm btn-primary me-1">Editar</button>
                  <button class="btn btn-sm btn-danger">Borrar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card">
        <div class="card-header fw-bold">Historial de Compras</div>
        <div class="card-body table-responsive">
          <table class="table align-middle">
            <thead class="table-light">
              <tr>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Producto</th>
                <th>Monto</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>01/01/2025</td>
                <td>Ejemplo Nombre</td>
                <td>Producto X</td>
                <td>100.00</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th colspan="3" class="text-end">Total:</th>
                <th>100.00</th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Modal Confirmar Borrar -->
<div class="modal fade" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Confirmar eliminación</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <p>¿Eliminar este cliente?</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        <button type="button" class="btn btn-danger">Eliminar</button>
      </div>
    </div>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>