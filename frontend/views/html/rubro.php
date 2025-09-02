<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Gestión de Rubros (Frontend)</title>
  <link rel="stylesheet" href="rubro.css" />
</head>
<body>
  <header class="app-header">
    <h1>Gestión de Rubros</h1>
    <p class="subtitle">Frontend puro — HTML + CSS (sin JS)</p>
  </header>

  <main class="container">
    <!-- AÑADIR RUBRO -->
    <section class="card">
      <h2 class="card-title">Añadir nuevo rubro</h2>
      <form action="#" method="post" class="form-grid">
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

      <!-- Form para eliminar rubros seleccionados -->
      <form action="#" method="post">
        <div class="rubro-list">
          <!-- EJEMPLO DE RUBRO 1 -->
          <details class="rubro" open>
            <summary>
              <div class="rubro-summary">
                <div class="rubro-title">
                  <input type="checkbox" name="rubro_delete[]" value="1" aria-label="Seleccionar rubro Ferretería para eliminar" />
                  <h3>Ferretería</h3>
                </div>
                <p class="rubro-desc">Herramientas, tornillos, bulonería y accesorios.</p>
              </div>
            </summary>

            <!-- Productos del rubro -->
            <div class="productos">
              <h4>Productos</h4>

              <!-- Quitar productos -->
              <fieldset class="productos-list">
                <legend class="visually-hidden">Quitar productos</legend>
                <label class="producto-item">
                  <input type="checkbox" name="producto_delete[]" value="1-1001" />
                  <span>Martillo carpintero N°3</span>
                </label>
                <label class="producto-item">
                  <input type="checkbox" name="producto_delete[]" value="1-1002" />
                  <span>Taladro percutor 850W</span>
                </label>
                <label class="producto-item">
                  <input type="checkbox" name="producto_delete[]" value="1-1003" />
                  <span>Caja de tornillos 4x30 (100u)</span>
                </label>
              </fieldset>

              <div class="form-actions compact">
                <button type="submit" name="accion" value="quitar_productos" class="btn danger">Quitar seleccionados</button>
              </div>

              <!-- Añadir producto -->
              <form action="#" method="post" class="subform">
                <input type="hidden" name="rubro_id" value="1" />
                <div class="form-grid">
                  <div class="form-field full">
                    <label for="p-nombre-1">Nombre del producto</label>
                    <input id="p-nombre-1" name="producto_nombre" type="text" placeholder="Ej: Llave francesa 10”" required />
                  </div>
                  <div class="form-field full">
                    <label for="p-descripcion-1">Descripción</label>
                    <textarea id="p-descripcion-1" name="producto_descripcion" rows="2" placeholder="Detalles, medidas o marca" required></textarea>
                  </div>
                  <div class="form-actions compact">
                    <button type="submit" name="accion" value="agregar_producto" class="btn primary">Añadir producto</button>
                  </div>
                </div>
              </form>
            </div>
          </details>

          <!-- EJEMPLO DE RUBRO 2 -->
          <details class="rubro">
            <summary>
              <div class="rubro-summary">
                <div class="rubro-title">
                  <input type="checkbox" name="rubro_delete[]" value="2" aria-label="Seleccionar rubro Pinturería para eliminar" />
                  <h3>Pinturería</h3>
                </div>
                <p class="rubro-desc">Pinturas, diluyentes, rodillos y pinceles.</p>
              </div>
            </summary>

            <div class="productos">
              <h4>Productos</h4>

              <fieldset class="productos-list">
                <legend class="visually-hidden">Quitar productos</legend>
                <label class="producto-item">
                  <input type="checkbox" name="producto_delete[]" value="2-2001" />
                  <span>Latex interior blanco 20L</span>
                </label>
                <label class="producto-item">
                  <input type="checkbox" name="producto_delete[]" value="2-2002" />
                  <span>Rodillo felpudo 23cm</span>
                </label>
              </fieldset>

              <div class="form-actions compact">
                <button type="submit" name="accion" value="quitar_productos" class="btn danger">Quitar seleccionados</button>
              </div>

              <form action="#" method="post" class="subform">
                <input type="hidden" name="rubro_id" value="2" />
                <div class="form-grid">
                  <div class="form-field full">
                    <label for="p-nombre-2">Nombre del producto</label>
                    <input id="p-nombre-2" name="producto_nombre" type="text" placeholder="Ej: Esmalte sintético negro" required />
                  </div>
                  <div class="form-field full">
                    <label for="p-descripcion-2">Descripción</label>
                    <textarea id="p-descripcion-2" name="producto_descripcion" rows="2" placeholder="Detalles, base, rendimiento" required></textarea>
                  </div>
                  <div class="form-actions compact">
                    <button type="submit" name="accion" value="agregar_producto" class="btn primary">Añadir producto</button>
                  </div>
                </div>
              </form>
            </div>
          </details>
        </div>

        <div class="form-actions sticky">
          <button type="submit" name="accion" value="quitar_rubros" class="btn danger">Quitar rubros seleccionados</button>
        </div>
      </form>
    </section>
  </main>

  <footer class="app-footer">
    <small>© Tu Negocio — Demo de interfaz sin backend ni JavaScript</small>
  </footer>
</body>
</html>
