<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Registrar Venta</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
  <!-- CSS de Tom Select -->
  <link href="https://cdn.jsdelivr.net/npm/tom-select/dist/css/tom-select.css" rel="stylesheet">
  <style>
    body {
      display: none;
    }

    body.bg-dark {
      color: #f8f9fa;
    }

    .bg-white-dark {
      background-color: #212529 !important;
    }

    .table-light-dark {
      background-color: #343a40 !important;
      color: #f8f9fa;
    }

    .form-control-dark {
      background-color: #343a40;
      color: #f8f9fa;
      border: 1px solid #495057;
    }

    .form-select-dark {
      background-color: #343a40;
      color: #f8f9fa;
      border: 1px solid #495057;
    }
  </style>
</head>

<body class="bg-dark">
  <?php include 'navbar.php'; ?>

  <div class="container my-5">

    <!-- TÍTULO -->
    <h1 class="text-center mb-4">Registrar venta</h1>

    <!-- AGREGAR PRODUCTO -->
    <div class="mb-4">
      <label for="seleccionar_producto" class="form-label fw-bold">Agregar producto</label>
      <select class="form-select form-select-dark" id="seleccionar_producto" aria-label="Seleccionar producto">
        <option value="" disabled selected>Seleccionar producto</option>
      </select>
    </div>

    <!-- TABLA DE PRODUCTOS CON SCROLL -->
    <div class="bg-white-dark p-3 rounded shadow-sm mb-4" style="max-height: 330px; overflow-y: auto;">
      <table class="table table-bordered text-center align-middle" id="tabla_productos"
        aria-label="Tabla de productos añadidos a la venta">
        <thead class="table-light-dark">
          <tr>
            <th>Código</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <!-- Filas se agregan con JavaScript -->
        </tbody>
      </table>
    </div>

    <!-- MÉTODO DE PAGO -->
    <div class="mb-4">
      <label for="metodo_de_pago" class="form-label fw-bold">Método de pago</label>
      <select class="form-select form-select-dark" id="metodo_de_pago" required aria-required="true"
        aria-label="Método de pago">
        <option value="" disabled selected>Seleccionar método de pago</option>
      </select>
    </div>

    <!-- CAMPOS ADICIONALES SEGÚN EL MÉTODO DE PAGO -->
    <div id="campos_adicionales_pago" class="mb-4" aria-live="polite" aria-atomic="true">
      <!-- Este bloque se rellena con JavaScript -->
    </div>

    <!-- CLIENTES -->
    <div class="mb-4">
      <label for="seleccionar_cliente" class="form-label fw-bold">Cliente</label>
      <div class="input-group">
        <select class="form-select form-select-dark" id="seleccionar_cliente" aria-label="Seleccionar cliente">
          <option value="0" selected>Consumidor Final</option>
        </select>
        <button class="btn btn-outline-primary" type="button" id="btn_agregar_cliente" aria-label="Agregar cliente">+</button>
      </div>
    </div>

    <!-- CAMPOS DE TOTALES AL FINAL -->
    <div class="d-flex justify-content-end gap-3 mb-4">
      <div class="col-md-2">
        <label for="descuento" class="form-label">Descuento (%)</label>
        <input type="number" class="form-control text-end form-control-dark" id="descuento" min="0" value="0"
          aria-describedby="descuentoHelp">
        <div id="descuentoHelp" class="form-text text-light">Ingrese descuento en porcentaje</div>
      </div>
      <div class="col-md-2">
        <label for="total_venta" class="form-label">Total</label>
        <input type="text" class="form-control text-end form-control-dark" id="total_venta" readonly
          aria-readonly="true">
      </div>
    </div>

    <!-- Campo IVA oculto -->
    <input type="hidden" id="iva" value="21">

    <!-- BOTONES FINALES -->
    <div class="d-flex justify-content-between">
      <button type="button" class="btn btn-success" id="boton_finalizar" aria-label="Finalizar venta">Finalizar</button>
      <button type="button" class="btn btn-danger" id="boton_cancelar" aria-label="Cancelar venta">Cancelar</button>
    </div>

    <!-- SECCIÓN RECIBO E IMPRESIÓN -->
    <div class="mt-4 d-flex align-items-center gap-3">
      <h4 class="mb-0">Recibo</h4>
      <button id="btn_imprimir_recibo" class="btn btn-secondary" disabled>Imprimir Recibo</button>
    </div>

    <!-- RESULTADO -->
    <div id="mensaje_resultado" class="mt-4" role="alert" aria-live="polite"></div>

  </div>

  <!-- MODAL PARA AGREGAR CLIENTE -->
  <div class="modal fade" id="modalCliente" tabindex="-1" aria-labelledby="modalClienteLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content bg-dark text-light">
        <div class="modal-header">
          <h5 class="modal-title" id="modalClienteLabel">Agregar Cliente</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
        </div>
        <div class="modal-body">
          <form id="form_cliente">
            <div class="mb-3">
              <label for="cliente_nombre" class="form-label">Nombre</label>
              <input type="text" class="form-control form-control-dark" id="cliente_nombre" required>
            </div>
            <div class="mb-3">
              <label for="cliente_apellido" class="form-label">Apellido</label>
              <input type="text" class="form-control form-control-dark" id="cliente_apellido">
            </div>
            <div class="mb-3">
              <label for="cliente_cuit" class="form-label">CUIT/CUIL</label>
              <input type="text" class="form-control form-control-dark" id="cliente_cuit" placeholder="20-12345678-9"
                required>
            </div>
            <div class="mb-3">
              <label for="cliente_email" class="form-label">Email</label>
              <input type="email" class="form-control form-control-dark" id="cliente_email" required>
            </div>
            <div class="mb-3">
              <label for="cliente_telefono" class="form-label">Teléfono</label>
              <input type="text" class="form-control form-control-dark" id="cliente_telefono">
            </div>
            <div class="mb-3">
              <label for="cliente_direccion" class="form-label">Dirección</label>
              <input type="text" class="form-control form-control-dark" id="cliente_direccion">
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
          <button type="button" class="btn btn-primary" id="guardar_cliente">Guardar</button>
        </div>
      </div>
    </div>
  </div>

  <!-- SCRIPTS -->
  <script src="../js/config.js"></script>
  <script src="../js/dashboard-proteccion.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/tom-select/dist/js/tom-select.complete.min.js"></script>
  <script src="../js/ventas.js"></script>
</body>

</html>