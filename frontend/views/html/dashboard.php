<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Panel Principal</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="../css/style.css">

  <?php include 'navbar.php'; ?>

</head>
<body>

<!-- ICONOS -->
<div class="container">
  <div class="row g-4">
    <!-- Artículos -->
    <div class="col-6 col-md-3">
      <a href="productos.php" class="text-decoration-none">
        <div class="icon-card border shadow-sm">
          <img src="img/articulos.png" alt="Artículos">
          <div class="icon-title">Artículos</div>
        </div>
      </a>
    </div>

    <!-- Proveedores -->
    <div class="col-6 col-md-3">
      <a href="proveedores.html" class="text-decoration-none">
        <div class="icon-card border shadow-sm">
          <img src="img/proveedores.png" alt="Proveedores">
          <div class="icon-title">Proveedores</div>
        </div>
      </a>
    </div>

    <!-- Compras -->
    <div class="col-6 col-md-3">
      <a href="compras.html" class="text-decoration-none">
        <div class="icon-card border shadow-sm">
          <img src="img/compras.png" alt="Compras">
          <div class="icon-title">Compras</div>
        </div>
      </a>
    </div>

    <!-- Ventas -->
    <div class="col-6 col-md-3">
      <a href="ventas.php" class="text-decoration-none">
        <div class="icon-card border shadow-sm">
          <img src="img/ventas.png" alt="Ventas">
          <div class="icon-title">Ventas</div>
        </div>
      </a>
    </div>

    <!-- Caja -->
    <div class="col-6 col-md-3">
      <a href="caja.html" class="text-decoration-none">
        <div class="icon-card border shadow-sm">
          <img src="img/caja.png" alt="Caja">
          <div class="icon-title">Caja</div>
        </div>
      </a>
    </div>

    <!-- Movimientos -->
    <div class="col-6 col-md-3 solo-admin">
      <a href="movimientos.html" class="text-decoration-none">
        <div class="icon-card border shadow-sm">
          <img src="img/movimientos.png" alt="Movimientos">
          <div class="icon-title">Movimientos</div>
        </div>
      </a>
    </div>
  </div>
</div>

<div class="container mt-5">
  <div class="card shadow rounded-4">
    <div class="card-body">
      <h3 class="card-title mb-4 text-center text-primary fw-bold">📊 Estadísticas Generales</h3>

      <div class="row g-4">
        <!-- Tarjetas resumen -->
        <div class="col-md-3 col-sm-6">
          <div class="card  border-start border-primary border-5 shadow-sm h-100">
            <div class="card-body">
              <h6 class="card-title text-muted">Ganancia Hoy</h6>
              <p class="h5 fw-bold mb-0" id="gananciaHoy">$0</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-sm-6">
          <div class="card  border-start border-success border-5 shadow-sm h-100">
            <div class="card-body">
              <h6 class="card-title text-muted">Ganancia del Mes</h6>
              <p class="h5 fw-bold mb-0" id="gananciaMes">$0</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-sm-6">
          <div class="card  border-start border-warning border-5 shadow-sm h-100">
            <div class="card-body">
              <h6 class="card-title text-muted">Ganancia del Año</h6>
              <p class="h5 fw-bold mb-0" id="gananciaAnio">$0</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-sm-6">
          <div class="card  border-start border-danger border-5 shadow-sm h-100">
            <div class="card-body">
              <h6 class="card-title text-muted">Más Vendido</h6>
              <p class="h6 fw-semibold mb-0" id="productoMasVendido">---</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Gráfico -->
      <div class="mt-5">
        <h5 class="text-center text-secondary mb-3">🛒 Productos Más Vendidos</h5>
        <canvas id="graficoTopProductos" height="120"></canvas>
      </div>
    </div>
  </div>
</div>
  <script src="../js/theme.js"></script>
<script src="../js/config.js"></script>
<script src="../js/dashboard-proteccion.js"></script>
<script src="../js/estadisticas.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>