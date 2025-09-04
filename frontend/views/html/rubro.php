<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Gestión de Rubros (Frontend)</title>
  <link rel="stylesheet" href="../css/rubro.css" />
</head>
<?php include 'navbar.php'; ?>
<body>

  <main class="container">
    <!-- AÑADIR RUBRO -->
    <section class="card">
      <h2 class="card-title">Añadir nuevo rubro</h2>
      <form id="form-nuevo-rubro" class="form-grid">
        <div class="form-field">
          <label for="rubro-nombre">Nombre del rubro</label>
          <input id="rubro-nombre" name="rubro_nombre" type="text" placeholder="Ej: Ferretería" required />
        </div>
        <div class="form-actions">
          <button type="submit" class="btn primary">Añadir rubro</button>
        </div>
      </form>
    </section>
  </main>

  <footer class="app-footer">
  </footer>
  <script src="../js/rubro.js"></script>
</body>
</html>