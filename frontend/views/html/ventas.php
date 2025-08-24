dame estilo con boostrap en dark
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
      /* Oculta toda la página inicialmente */
    }
  </style>
</head>

<body>
  <?php include 'navbar.php'; ?>

  <div class="container my-5">

    <!-- TÍTULO -->
    <h1 class="text-center mb-4">Registrar venta</h1>

    <!-- AGREGAR PRODUCTO -->
    <div class="mb-4">
      <label for="seleccionar_producto" class="form-label fw-bold">Agregar producto</label>
      <div class="row g-2">
        <div class="col-md-6">
          <select class="form-select" id="seleccionar_producto" aria-label="Seleccionar producto">
            <option value="" disabled>Seleccionar producto</option>
          </select>
        </div>
        <div class="col-md-6">
          <label for="codigo_de_barras" class="visually-hidden">Código de barras</label>
          <input type="text" class="form-control" id="codigo_de_barras" placeholder="Escanear código de barras"
            autocomplete="off" aria-label="Escanear código de barras">
        </div>
      </div>
    </div>

    <!-- TABLA DE PRODUCTOS -->
    <div class="bg-white p-3 rounded shadow-sm mb-4">
      <table class="table table-bordered text-center align-middle" id="tabla_productos"
        aria-label="Tabla de productos añadidos a la venta">
        <thead class="table-light">
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

    <!-- CAMPOS DE TOTALES -->
    <div class="row mb-4">
      <div class="col-md-3">
        <label for="precio_unitario" class="form-label">Precio unitario</label>
        <input type="text" class="form-control text-end" id="precio_unitario" readonly aria-readonly="true">
      </div>
      <div class="col-md-3">
        <label for="descuento" class="form-label">Descuento (%)</label>
        <input type="number" class="form-control" id="descuento" min="0" value="0" aria-describedby="descuentoHelp">
        <div id="descuentoHelp" class="form-text">Ingrese descuento en porcentaje</div>
      </div>
      <div class="col-md-3">
        <label for="iva" class="form-label">IVA (%)</label>
        <input type="number" class="form-control" id="iva" value="21" aria-describedby="ivaHelp">
        <div id="ivaHelp" class="form-text">Ingrese porcentaje de IVA aplicado</div>
      </div>
      <div class="col-md-3">
        <label for="total_venta" class="form-label">Total</label>
        <input type="text" class="form-control text-end" id="total_venta" readonly aria-readonly="true">
      </div>
    </div>

    <!-- MÉTODO DE PAGO -->
    <div class="mb-4">
      <label for="metodo_de_pago" class="form-label fw-bold">Método de pago</label>
      <select class="form-select" id="metodo_de_pago" required aria-required="true" aria-label="Método de pago">
        <option value="" disabled selected>Seleccionar método de pago</option>
      </select>
    </div>

    <!-- CLIENTES -->
    <div class="mb-4">
      <label for="seleccionar_cliente" class="form-label fw-bold">Cliente</label>
      <div class="input-group">
        <select class="form-select" id="seleccionar_cliente" aria-label="Seleccionar cliente">
          <option value="" disabled selected>Seleccionar cliente</option>
        </select>
        <button class="btn btn-outline-primary" type="button" id="btn_agregar_cliente" aria-label="Agregar cliente">+</button>
      </div>
    </div>

    <!-- CAMPOS ADICIONALES SEGÚN EL MÉTODO DE PAGO -->
    <div id="campos_adicionales_pago" class="mb-4" aria-live="polite" aria-atomic="true">
      <!-- Este bloque se rellena con JavaScript -->
    </div>

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
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalClienteLabel">Agregar Cliente</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
        </div>
        <div class="modal-body">
          <form id="form_cliente">
            <div class="mb-3">
              <label for="cliente_nombre" class="form-label">Nombre</label>
              <input type="text" class="form-control" id="cliente_nombre" required>
            </div>
            <div class="mb-3">
              <label for="cliente_apellido" class="form-label">Apellido</label>
              <input type="text" class="form-control" id="cliente_apellido">
            </div>
            <div class="mb-3">
              <label for="cliente_dni" class="form-label">DNI</label>
              <input type="text" class="form-control" id="cliente_dni" required>
            </div>
            <div class="mb-3">
              <label for="cliente_email" class="form-label">Email</label>
              <input type="email" class="form-control" id="cliente_email" required>
            </div>
            <div class="mb-3">
              <label for="cliente_telefono" class="form-label">Teléfono</label>
              <input type="text" class="form-control" id="cliente_telefono">
            </div>
            <div class="mb-3">
              <label for="cliente_direccion" class="form-label">Dirección</label>
              <input type="text" class="form-control" id="cliente_direccion">
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
  <!-- JS de Tom Select -->
  <script src="https://cdn.jsdelivr.net/npm/tom-select/dist/js/tom-select.complete.min.js"></script>
  <!-- Tu JS de ventas -->
  <script src="../js/ventas.js"></script>
</body>

</html>