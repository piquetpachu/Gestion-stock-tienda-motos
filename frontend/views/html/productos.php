<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Gestión de Productos</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
  <link rel="stylesheet" href="../css/style.css">

<!-- Tom Select -->
<link href="https://cdn.jsdelivr.net/npm/tom-select@2.3.1/dist/css/tom-select.bootstrap5.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/tom-select@2.3.1/dist/js/tom-select.complete.min.js"></script>
<link rel="stylesheet" href="../css/style.css">
</head>

<body>
  <?php include 'navbar.php'; ?>
  <div class="container page-container">
    <div class="page-card">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>
        <svg xmlns="http://www.w3.org/2000/svg" class="title-icon" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path d="M3.75 0a1 1 0 0 0-.8.4L.1 4.2a.5.5 0 0 0-.1.3V15a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V4.5a.5.5 0 0 0-.1-.3L13.05.4a1 1 0 0 0-.8-.4zM15 4.667V5H1v-.333L1.5 4h6V1h1v3h6z"/>
        </svg>
        Gestión de Productos
      </h1>
      <button class="btn btn-success d-inline-flex align-items-center gap-1" onclick="nuevoProducto()" id="btnAgregarProducto" style="display: none;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
        </svg>
        Agregar Producto
      </button>
    </div>

    <!-- Filtros -->
    <div class="row mb-3">
  <div class="col-md-6">
<input type="text" id="busqueda" class="form-control" placeholder="Buscar por nombre, precio, código o fecha..." />
      </div>
      <div class="col-md-6">
        <select id="ordenarPor" class="form-select">
          <option value="nombre">Ordenar por: Nombre</option>
          <option value="fecha_alta">Fecha Alta</option>
          <option value="precio_venta">Precio Venta</option>
          <option value="codigo_barras">Código de Barras</option>
        </select>
      </div>
    </div>

    <!-- Tabla -->
    <div class="table-responsive">
      <table class="table table-striped table-hover table-bordered align-middle">
        <thead class="table-dark">
          <tr>
            <th>Nombre</th>
            <th>Venta</th>
            <th>Compra</th>
            <th>Stock</th>
            <th>Mínimo</th>
            <th>Cód. Barras</th>
            <th>fecha</th>
            <th id="colAcciones" class="acciones-col" style="display: none;">Acciones</th>
            <!-- <th>Acciones</th> -->
          </tr>
        </thead>
        <tbody id="tablaProductos"></tbody>
      </table>
    </div>

    <!-- Paginación -->
    <nav>
      <ul class="pagination justify-content-center" id="paginacion"></ul>
    </nav>
    </div>
  </div>
  <!-- Modal Detalle de Producto -->
<div class="modal fade" id="modalDetalles" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header bg-primary text-white">
        <h5 class="modal-title" id="modalDetallesLabel">Detalles del Producto</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body" id="detalleProducto">
        <p class="text-muted text-center">Selecciona un producto para ver sus detalles.</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
      </div>
    </div>
  </div>
</div>

  <!-- Modal Producto -->
  <div class="modal fade" id="modalProducto" tabindex="-1" aria-hidden="true" >
    <div class="modal-dialog modal-lg">
      <form id="formProducto" class="modal-content" autocomplete="off">
        <div class="modal-header">
          <h5 class="modal-title">Producto</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body row g-3">
  <input type="hidden" id="id_producto" />

  <div class="col-md-6">
    <label for="nombre" class="form-label">Nombre</label>
    <input type="text" id="nombre" class="form-control" placeholder="Ej: Casco integral" required />
  </div>

  <div class="col-md-6">
    <label for="descripcion" class="form-label">Descripción</label>
    <input type="text" id="descripcion" class="form-control" placeholder="Ej: Casco con visor y ventilación" />
  </div>

  <div class="col-md-4">
    <label for="precio_venta" class="form-label">Precio de Venta</label>
    <input type="number" id="precio_venta" class="form-control" placeholder="Ej: 15000" step="0.01" />
  </div>

  <div class="col-md-4">
    <label for="precio_compra" class="form-label">Precio de Compra</label>
    <input type="number" id="precio_compra" class="form-control" placeholder="Ej: 12000" step="0.01" />
  </div>

  <div class="col-md-4">
    <label for="stock" class="form-label">Stock</label>
    <input type="number" id="stock" class="form-control" placeholder="Ej: 50" />
  </div>

  <div class="col-md-4">
    <label for="stock_minimo" class="form-label">Stock Mínimo</label>
    <input type="number" id="stock_minimo" class="form-control" placeholder="Ej: 5" />
  </div>

  <div class="col-md-4">
    <label for="codigo_barras" class="form-label">Código de Barras</label>
    <input type="text" id="codigo_barras" class="form-control" placeholder="Ej: 7894561237890" />
  </div>

  <div class="col-md-6">
    <label for="id_proveedor" class="form-label">Proveedor</label>
    <div class="input-group">
      <select id="id_proveedor" class="form-select">
        <option value="">Seleccione proveedor</option>
        <!-- Cargado dinámicamente -->
      </select>
      <button type="button" class="btn btn-outline-primary" id="btnNuevoProveedor" title="Agregar proveedor">+</button>
    </div>
  </div>

  <div class="col-md-6">
    <label for="id_rubro" class="form-label">Rubro</label>
    <div class="input-group">
      <select id="id_rubro" class="form-select">
        <option value="">Seleccione rubro</option>
        <!-- Cargado dinámicamente -->
      </select>
      <button type="button" class="btn btn-outline-primary" id="btnNuevoRubro" title="Agregar rubro">+</button>
    </div>
  </div>

  <div class="col-md-6">
    <label for="activo" class="form-label">Estado</label>
    <select id="activo" class="form-select">
      <option value="1">Activo</option>
      <option value="0">Inactivo</option>
    </select>
  </div>
</div>

        <div class="modal-footer">
          <button type="submit" class="btn btn-primary">Guardar</button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal para nuevo rubro -->
<div class="modal fade" id="modalNuevoRubro" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog">
    <form id="form-nuevo-rubro" class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Agregar Rubro</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <input type="text" name="rubro_nombre" class="form-control" placeholder="Nombre del rubro" required />
      </div>
      <div class="modal-footer">
        <button type="submit" class="btn btn-primary">Guardar</button>
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
      </div>
    </form>
  </div>
</div>

<!-- Modal para nuevo proveedor (alineado con validaciones de Ventas) -->
<div class="modal fade" id="modalNuevoProveedor" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog">
    <form id="form-nuevo-proveedor" class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Agregar Proveedor</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <div class="mb-2">
          <label class="form-label" for="prov_nombre">Nombre <span class="text-danger">*</span></label>
          <input type="text" id="prov_nombre" name="proveedor_nombre" class="form-control" placeholder="Nombre del proveedor" required />
        </div>
        <div class="mb-2">
          <label class="form-label" for="prov_cuit">CUIT</label>
          <input type="text" id="prov_cuit" name="proveedor_cuit" class="form-control" placeholder="##-########-#" maxlength="13" inputmode="numeric" pattern="\d{2}-\d{8}-\d" />
        </div>
        <div class="mb-2">
          <label class="form-label" for="prov_telefono">Teléfono</label>
          <input type="tel" id="prov_telefono" name="proveedor_telefono" class="form-control" placeholder="Solo números" maxlength="15" inputmode="numeric" pattern="\d+" />
        </div>
        <div class="mb-2">
          <label class="form-label" for="prov_email">Email</label>
          <input type="email" id="prov_email" name="proveedor_email" class="form-control" placeholder="Email (opcional)" />
        </div>
        <div class="mb-2">
          <label class="form-label" for="prov_direccion">Dirección</label>
          <input type="text" id="prov_direccion" name="proveedor_direccion" class="form-control" placeholder="Dirección (opcional)" />
        </div>
      </div>
      <div class="modal-footer">
        <button type="submit" class="btn btn-primary">Guardar</button>
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
      </div>
    </form>
  </div>
</div>

  <!-- Scripts -->
  <script src="../js/theme.js"></script>
  <script src="../js/config.js"></script>
  <script src="../js/dashboard-proteccion.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script src="../js/productos.js?v=20251022-02"></script>
</body>
</html>
