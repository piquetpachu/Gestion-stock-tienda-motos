<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Gestión de Productos</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />

<!-- Tom Select -->
<link href="https://cdn.jsdelivr.net/npm/tom-select@2.3.1/dist/css/tom-select.bootstrap5.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/tom-select@2.3.1/dist/js/tom-select.complete.min.js"></script>
<link rel="stylesheet" href="../css/style.css">

</head>

<style>
       body { 
            display: none; /* Oculta toda la página inicialmente */
        }
            /* style.css */
body.dark-theme .btn {
  background-color: #222;
  color: #fff;
  border-color: #444;
}
body.dark-theme .btn-warning {
  background-color: #444;
  color: #ffd700;
}
body.dark-theme .btn-danger {
  background-color: #880000;
  color: #fff;
}
</style> 
  <?php include 'navbar.php'; ?>

<body >
  <div class="container mt-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>📦 Gestión de Productos</h1>
      <button class="btn btn-success" onclick="nuevoProducto()" id="btnAgregarProducto" style="display: none;">➕ Agregar Producto</button>
    </div>

    <!-- Filtros -->
    <div class="row mb-3">
      <div class="col-md-6">
<input type="text" id="busqueda" class="form-control" placeholder="🔍 Buscar por nombre, precio, código o fecha..." />
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
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Venta</th>
            <th>Compra</th>
            <th>Stock</th>
            <th>Mínimo</th>
            <th>Cód. Barras</th>
            <th>fecha</th>
            <th id="colAcciones" style="display: none;">Acciones</th>
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
          <div class="col-md-6"><input type="text" id="nombre" class="form-control" placeholder="Nombre" required /></div>
          <div class="col-md-6"><input type="text" id="descripcion" class="form-control" placeholder="Descripción" /></div>
          <div class="col-md-4"><input type="number" id="precio_venta" class="form-control" placeholder="Precio Venta" step="0.01" /></div>
          <div class="col-md-4"><input type="number" id="precio_compra" class="form-control" placeholder="Precio Compra" step="0.01" /></div>
          <div class="col-md-4"><input type="number" id="stock" class="form-control" placeholder="Stock" /></div>
          <div class="col-md-4"><input type="number" id="stock_minimo" class="form-control" placeholder="Stock Mínimo" /></div>
          <div class="col-md-4"><input type="text" id="codigo_barras" class="form-control" placeholder="Código de Barras" /></div>
          <!-- <div class="col-md-4"><input type="date" id="fecha_alta" class="form-control" /></div> -->
<div class="col-md-6">
  <label for="id_proveedor" class="form-label">Proveedor</label>
  <select id="id_proveedor" class="form-select"  style="width: 100%">
    <option value="">Seleccione proveedor</option>
    <!-- Las opciones se agregan dinámicamente -->
  </select>
</div>
<div class="col-md-6">
  <label for="id_rubro" class="form-label">Rubro</label>
  <select id="id_rubro" class="form-select">
    <option value="">Seleccione rubro</option>
    <!-- Se cargará con JS -->
  </select>
</div>
          <div class="col-md-6">
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

  <!-- Scripts -->
  <script src="../js/theme.js"></script>
   <script src="../js/config.js"></script>
  <script src="../js/dashboard-proteccion.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script src="../js/productos.js"></script>
  <script src="../js/index.js"></script>
</body>
</html>
