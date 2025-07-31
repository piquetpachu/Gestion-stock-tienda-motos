<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Panel Principal</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="<?php echo 'frontend/views/css/style.css'; ?>">
  <link rel="stylesheet" href="../views/css/style.css">

  <?php include 'navbar.php'; ?>

</head>
<body>

<!-- ICONOS -->
<div class="container">
  <div class="row g-4">
    <!-- Artículos -->
    <div class="col-6 col-md-3">
      <a href="articulos.html" class="text-decoration-none">
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
      <a href="ventas.html" class="text-decoration-none">
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
    <div class="col-6 col-md-3">
      <a href="movimientos.html" class="text-decoration-none">
        <div class="icon-card border shadow-sm">
          <img src="img/movimientos.png" alt="Movimientos">
          <div class="icon-title">Movimientos</div>
        </div>
      </a>
    </div>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>