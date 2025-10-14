<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Mi Perfil</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
  <link rel="stylesheet" href="../css/style.css">
</head>
<body>
  <?php include 'navbar.php'; ?>

  <div class="container py-4" id="perfil-contenido" style="display:none;">
    <h1 class="mb-4">👤 Mi Perfil</h1>

    <div id="perfil-alert" class="alert d-none" role="alert"></div>

    <div class="card shadow-sm">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">ID</label>
            <input class="form-control" id="perfil-id" disabled />
          </div>
          <div class="col-md-6">
            <label class="form-label">Rol</label>
            <input class="form-control" id="perfil-rol" disabled />
          </div>
          <div class="col-md-6">
            <label class="form-label">Nombre</label>
            <input class="form-control" id="perfil-nombre" disabled />
          </div>
          <div class="col-md-6">
            <label class="form-label">Email</label>
            <input class="form-control" id="perfil-email" disabled />
          </div>
        </div>
      </div>
    </div>
  </div>

  <script src="../js/theme.js"></script>
  <script src="../js/config.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script src="../js/usuario.js"></script>
</body>
</html>
