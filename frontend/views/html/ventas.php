<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Registrar Venta</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
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

    .form-control-dark,
    .form-select-dark {
      background-color: #343a40;
      color: #f8f9fa;
      border: 1px solid #495057;
    }

    /* Contenedor principal estilo tablero */
    .venta-container {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
    }

    /* Cards con altura pareja */
    .venta-card {
      background: #212529;
      border-radius: 12px;
      padding: 1.2rem;
      box-shadow: 0 0 12px rgba(0, 0, 0, 0.3);
    }

    .venta-card h5 {
      margin-bottom: 1rem;
      font-weight: 600;
      border-bottom: 1px solid #495057;
      padding-bottom: .5rem;
    }

    #tabla_productos {
      font-size: 0.9rem;
    }

    #tabla_productos td input {
      max-width: 70px;
    }
  </style>
</head>

<body class="bg-dark">
  <?php include 'navbar.php'; ?>

  <div class="container my-4">
    <h1 class="text-center mb-4">Registrar venta</h1>

    <div class="venta-container">
      <!-- Columna izquierda -->
      <div class="venta-card">
        <h5>Productos</h5>
        <div class="mb-3">
          <label for="seleccionar_producto" class="form-label">Agregar producto</label>
          <select class="form-select form-select-dark" id="seleccionar_producto">
            <option value="" disabled selected>Seleccionar producto</option>
          </select>
        </div>
        <div class="bg-white-dark p-2 rounded" style="max-height: 250px; overflow-y:auto;">
          <table class="table table-sm table-bordered text-center align-middle" id="tabla_productos">
            <thead class="table-light-dark">
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

      <!-- Columna derecha -->
      <div class="venta-card">
        <h5>Detalles de venta</h5>

        <!-- Cliente -->
        <div class="mb-3">
          <label for="seleccionar_cliente" class="form-label">Cliente</label>
          <div class="input-group">
            <select class="form-select form-select-dark" id="seleccionar_cliente">
              <option value="0" selected>Consumidor Final</option>
            </select>
            <button class="btn btn-outline-primary" type="button" id="btn_agregar_cliente">+</button>
          </div>
        </div>

        <!-- Pago -->
        <div class="mb-3">
          <label for="metodo_de_pago" class="form-label">Método de pago</label>
          <div class="d-flex gap-2">
            <select class="form-select form-select-dark" id="metodo_de_pago">
              <option value="" disabled selected>Seleccionar método</option>
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="transferencia">Transferencia</option>
            </select>
            <button class="btn btn-secondary" type="button" id="btn_varios_metodos">Varios</button>
          </div>
        </div>

        <div id="bloque_varios_metodos" class="mb-3 p-2 bg-white-dark rounded">
          <label class="form-label">Varios métodos</label>
          <div class="small">
            <div class="form-check mb-1">
              <input class="form-check-input" type="checkbox" id="varios_efectivo">
              <label class="form-check-label" for="varios_efectivo">Efectivo</label>
              <input type="number" class="form-control form-control-dark mt-1" placeholder="Monto $" min="0">
            </div>
            <div class="form-check mb-1">
              <input class="form-check-input" type="checkbox" id="varios_tarjeta">
              <label class="form-check-label" for="varios_tarjeta">Tarjeta</label>
              <input type="number" class="form-control form-control-dark mt-1" placeholder="Monto $" min="0">
            </div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="varios_transferencia">
              <label class="form-check-label" for="varios_transferencia">Transferencia</label>
              <input type="number" class="form-control form-control-dark mt-1" placeholder="Monto $" min="0">
            </div>
          </div>
        </div>

        <div id="campos_adicionales_pago"></div>

        <!-- Totales -->
        <div class="row g-2 mb-3">
          <div class="col-6">
            <label for="descuento" class="form-label">Descuento (%)</label>
            <input type="number" class="form-control form-control-dark text-end" id="descuento" min="0" value="0">
          </div>
          <div class="col-6">
            <label for="total_venta" class="form-label">Total</label>
            <input type="text" class="form-control form-control-dark text-end" id="total_venta" readonly>
          </div>
        </div>

        <input type="hidden" id="iva" value="21">

        <!-- Botones -->
        <div class="d-flex justify-content-between mb-3">
          <button class="btn btn-success" id="boton_finalizar">Finalizar</button>
          <button class="btn btn-danger" id="boton_cancelar">Cancelar</button>
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

  <!-- Modal cliente -->
  <div class="modal fade" id="modalCliente" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content bg-dark text-light">
        <div class="modal-header">
          <h5 class="modal-title">Agregar Cliente</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <form id="form_cliente">
            <div class="mb-2"><label class="form-label">Nombre</label><input type="text" class="form-control form-control-dark" id="cliente_nombre" required></div>
            <div class="mb-2"><label class="form-label">Apellido</label><input type="text" class="form-control form-control-dark" id="cliente_apellido"></div>
            <div class="mb-2"><label class="form-label">CUIT/CUIL</label><input type="text" class="form-control form-control-dark" id="cliente_cuit" required></div>
            <div class="mb-2"><label class="form-label">Email</label><input type="email" class="form-control form-control-dark" id="cliente_email" required></div>
            <div class="mb-2"><label class="form-label">Teléfono</label><input type="text" class="form-control form-control-dark" id="cliente_telefono"></div>
            <div class="mb-2"><label class="form-label">Dirección</label><input type="text" class="form-control form-control-dark" id="cliente_direccion"></div>
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
  <script src="../js/config.js"></script>
  <script src="../js/dashboard-proteccion.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/tom-select/dist/js/tom-select.complete.min.js"></script>
  <script src="../js/ventas.js"></script>
</body>

</html>