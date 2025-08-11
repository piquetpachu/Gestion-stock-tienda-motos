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
<nav class="navbar navbar-expand-lg navbar-dark bg-primary">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Clientes</a>
    <button class="btn btn-light">Nuevo Cliente</button>
  </div>
</nav>

<div class="container my-4">
  <div class="row">
    <div class="col-lg-6">
      <div class="card mb-3">
        <div class="card-header">Formulario de Cliente</div>
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
            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
              <button type="button" class="btn btn-success">Guardar</button>
              <button type="button" class="btn btn-secondary">Limpiar</button>
            </div>
          </form>
        </div>
      </div>

      <div class="card">
        <div class="card-header">Registrar Compra</div>
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
            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
              <button class="btn btn-primary" type="button">Registrar Compra</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="col-lg-6">
      <div class="card mb-3">
        <div class="card-header">Lista de Clientes</div>
        <div class="card-body table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Contacto</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ejemplo Nombre</td>
                <td>Email<br>Teléfono<br>Dirección</td>
                <td>
                  <button class="btn btn-sm btn-primary me-1">Editar</button>
                  <button class="btn btn-sm btn-danger">Borrar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card">
        <div class="card-header">Historial de Compras</div>
        <div class="card-body table-responsive">
          <table class="table">
            <thead>
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