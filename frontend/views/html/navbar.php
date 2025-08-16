<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Navbar</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>

<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <div class="container-fluid">
    <a class="navbar-brand" href="dashboard.php">"LOGO"</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContenido" aria-controls="navbarContenido" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarContenido">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item"><a class="nav-link" href="productos.php">Gestión de Stock</a></li>
        <li class="nav-item"><a class="nav-link" href="clientes.php">Clientes</a></li>
        <li class="nav-item"><a class="nav-link" href="#">Deudores</a></li>
        <li class="nav-item"><a class="nav-link" href="#">Caja Diaria</a></li>
        <li class="nav-item"><a class="nav-link" href="#">Usuario</a></li>
        <li class="nav-item"><a class="nav-link" href="ventas.php">Ventas</a></li>
      </ul>
    </div>
  </div>
  <button id="logoutBtn" class="btn btn-danger">
    <i class="bi bi-box-arrow-right"></i> Cerrar Sesión
</button>
</nav>

<script src="../js/logout.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>