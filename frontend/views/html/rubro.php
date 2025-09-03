<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Gestión de Rubros (Frontend)</title>
  <link rel="stylesheet" href="../css/rubro.css" />
</head>
<body>
  <header class="app-header">
    <h1>Gestión de Rubros</h1>
    <p class="subtitle">Frontend — HTML + CSS + JS</p>
  </header>

  <main class="container">
    <!-- AÑADIR RUBRO -->
    <section class="card">
      <h2 class="card-title">Añadir nuevo rubro</h2>
      <form id="form-nuevo-rubro" class="form-grid">
        <div class="form-field">
          <label for="rubro-nombre">Nombre del rubro</label>
          <input id="rubro-nombre" name="rubro_nombre" type="text" placeholder="Ej: Ferretería" required />
        </div>
        <div class="form-field full">
          <label for="rubro-descripcion">Descripción</label>
          <textarea id="rubro-descripcion" name="rubro_descripcion" rows="3" placeholder="Breve descripción del rubro..." required></textarea>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn primary">Añadir rubro</button>
          <button type="reset" class="btn ghost">Limpiar</button>
        </div>
      </form>
    </section>

    <!-- LISTA DE RUBROS + QUITAR RUBROS -->
    <section class="card">
      <div class="card-header">
        <h2 class="card-title">Rubros existentes</h2>
        <p class="muted">Selecciona para quitar rubros o gestiona sus productos.</p>
      </div>
      <form id="form-quitar-rubros">
        <div id="rubro-list" class="rubro-list">
          <!-- Aquí se renderizan los rubros dinámicamente -->
        </div>
        <div class="form-actions sticky">
          <button type="submit" class="btn danger">Quitar rubros seleccionados</button>
        </div>
      </form>
    </section>
  </main>

  <footer class="app-footer">
    <small>© Tu Negocio — Interfaz conectada al backend</small>
  </footer>
  <script src="../js/rubro.js"></script>
</body>
</html>