<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Registrar Venta</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
  <link href="https://cdn.jsdelivr.net/npm/tom-select@2.3.1/dist/css/tom-select.bootstrap5.min.css" rel="stylesheet">
  <link rel="stylesheet" href="../css/style.css">
</head>

<body>
  <?php include 'navbar.php'; ?>

  <div class="container page-container">
    <div class="page-card">
    <h1 class="text-center mb-4 d-flex justify-content-center align-items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="title-icon" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9A1.5 1.5 0 0 1 1.432 2.001zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5z"/>
      </svg>
      Registrar venta
    </h1>

    <!-- Usamos grid de Bootstrap en vez de CSS fijo -->
    <div class="row g-3">
      <!-- Columna izquierda -->
      <div class="col-12 col-lg-8">
        <div class="venta-card">
          <h5>Productos</h5>
          <div class="mb-3">
            <label for="seleccionar_producto" class="form-label">Agregar producto</label>
            <select class="form-select" id="seleccionar_producto">
              <option value="" disabled selected>Seleccionar producto</option>
            </select>
          </div>
          <div class="p-2 rounded border" style="max-height: 250px; overflow-y:auto;">
            <table class="table table-sm table-bordered text-center align-middle" id="tabla_productos">
              <thead>
                <tr>
                  <th>Cód.</th>
                  <th>Producto</th>
                  <th>Cant.</th>
                  <th>Precio</th>
                  <th>Acc.</th>
                </tr>
              </thead>
              <tbody>
                <!-- filas dinámicas -->
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Columna derecha -->
      <div class="col-12 col-lg-4">
        <div class="venta-card">
          <h5>Detalles de venta</h5>

          <!-- Cliente -->
          <div class="mb-3">
            <label for="seleccionar_cliente" class="form-label">Cliente</label>
            <div class="input-group">
              <select class="form-select" id="seleccionar_cliente">
                <option value="0" selected>Consumidor Final</option>
              </select>
              <button class="btn btn-outline-primary" type="button" id="btn_agregar_cliente">+</button>
            </div>
          </div>

          <!-- Pago -->
          <div class="mb-3">
            <label for="metodo_de_pago" class="form-label">Método de pago</label>
            <div class="d-flex flex-wrap gap-2">
              <select class="form-select flex-grow-1" id="metodo_de_pago">
                <option value="" disabled selected>Seleccionar método</option>
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="transferencia">Transferencia</option>
              </select>
              <button class="btn btn-success" type="button" id="btn_varios_metodos">Varios</button>
            </div>
          </div>

          <div id="bloque_varios_metodos" class="mb-3 p-2 rounded border" style="display:none;">
            <label class="form-label">Varios métodos</label>
            <div class="small">
              <div class="form-check mb-1">
                <input class="form-check-input" type="checkbox" id="varios_efectivo">
                <label class="form-check-label" for="varios_efectivo">Efectivo</label>
                <input type="number" class="form-control mt-1" placeholder="Monto $" min="0">
              </div>
              <div class="form-check mb-1">
                <input class="form-check-input" type="checkbox" id="varios_tarjeta">
                <label class="form-check-label" for="varios_tarjeta">Tarjeta</label>
                <input type="number" class="form-control mt-1" placeholder="Monto $" min="0">
              </div>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="varios_transferencia">
                <label class="form-check-label" for="varios_transferencia">Transferencia</label>
                <input type="number" class="form-control mt-1" placeholder="Monto $" min="0">
              </div>
            </div>
          </div>

          <div id="campos_adicionales_pago"></div>

          <!-- Totales -->
          <div class="row g-2 mb-3">
            <div class="col-6">
              <label for="descuento" class="form-label">Descuento (%)</label>
              <input type="number" class="form-control text-end" id="descuento" min="0" value="0">
            </div>
            <div class="col-6">
              <label for="total_venta" class="form-label">Total</label>
              <input type="text" class="form-control text-end" id="total_venta" readonly>
            </div>
          </div>

          <input type="hidden" id="iva" value="21">

          <!-- Botones -->
          <div class="d-flex justify-content-between mb-3 flex-wrap gap-2">
            <button class="btn btn-success flex-grow-1" id="boton_finalizar">Finalizar</button>
            <button class="btn btn-danger flex-grow-1" id="boton_cancelar">Cancelar</button>
          </div>

          <!-- Recibo -->
          <div class="d-flex align-items-center gap-2">
            <h6 class="mb-0">Recibo</h6>
            <button id="btn_imprimir_recibo" class="btn btn-secondary btn-sm" disabled>Imprimir</button>
          </div>

          <div id="mensaje_resultado" class="mt-3"></div>
        </div>
      </div>
    </div>
    </div>
  </div>

  <!-- Modal cliente -->
  <div class="modal fade" id="modalCliente" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Agregar Cliente</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <form id="form_cliente">
            <div class="mb-2"><label class="form-label">Nombre</label><input type="text" class="form-control" id="cliente_nombre" required></div>
            <div class="mb-2"><label class="form-label">Apellido</label><input type="text" class="form-control" id="cliente_apellido"></div>
            <div class="mb-2"><label class="form-label">CUIT/CUIL</label><input type="text" class="form-control" id="cliente_cuit" required maxlength="13" inputmode="numeric" pattern="\d{2}-\d{8}-\d"></div>
            <div class="mb-2"><label class="form-label">Email</label><input type="email" class="form-control" id="cliente_email" required></div>
            <div class="mb-2"><label class="form-label">Teléfono</label><input type="text" class="form-control" id="cliente_telefono" maxlength="15" inputmode="numeric" pattern="\d+"></div>
            <div class="mb-2"><label class="form-label">Dirección</label><input type="text" class="form-control" id="cliente_direccion"></div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
          <button class="btn btn-primary" id="guardar_cliente">Guardar</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Scripts -->
  <script src="../js/theme.js"></script>
  <script src="../js/config.js"></script>
  <script src="../js/dashboard-proteccion.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/tom-select/dist/js/tom-select.complete.min.js"></script>
  <script src="../js/ventas.js?v=20251022-02"></script>
</body>

</html>