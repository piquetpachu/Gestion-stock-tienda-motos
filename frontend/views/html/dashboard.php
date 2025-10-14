<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Panel Principal</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="../css/style.css">

<head>

  <?php include 'navbar.php'; ?>

</head>
<body>

<div class="container mt-5">
  <div id="alertRol" class="alert alert-warning d-none" role="alert"></div>
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
        <div class="row g-4">
          <div class="col-lg-6">
            <div class="card h-100">
              <div class="card-body">
                <h6 class="mb-3">📈 Ventas por día (año en curso)</h6>
                <div id="msgVentasPorDia" class="text-center text-secondary small">Cargando...</div>
                <canvas id="graficoVentasPorDia" height="140" style="display:none"></canvas>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="card h-100">
              <div class="card-body">
                <h6 class="mb-3">🏷️ Ingresos por Rubro (año en curso)</h6>
                <div id="msgIngresosPorRubro" class="text-center text-secondary small">Cargando...</div>
                <canvas id="graficoIngresosPorRubro" height="140" style="display:none"></canvas>
              </div>
            </div>
          </div>
        </div>

        <div class="row g-4 mt-1">
          <div class="col-lg-7">
            <div class="card h-100">
              <div class="card-body">
                <h6 class="mb-3">🛒 Productos Más Vendidos</h6>
                <canvas id="graficoTopProductos" height="160"></canvas>
              </div>
            </div>
          </div>
          <div class="col-lg-5">
            <div class="card h-100">
              <div class="card-body">
                <h6 class="mb-3">📦 Stock bajo mínimo</h6>
                <div class="table-responsive" style="max-height: 360px;">
                  <table class="table table-sm table-striped align-middle">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Rubro</th>
                        <th class="text-end">Stock</th>
                        <th class="text-end">Mín.</th>
                      </tr>
                    </thead>
                    <tbody id="tbodyStockBajoMinimo">
                      <tr><td colspan="4" class="text-center text-secondary">Cargando...</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      // Ocultar cualquier acceso directo a usuarios si existe en el dashboard
      const atajos = document.querySelectorAll('a[href$="usuarios.php"], a[href*="/usuarios.php"]');
      atajos.forEach(a => a.style.display = 'none');

      fetch('/Gestion-stock-tienda-motos/app/usuario-info', { credentials: 'same-origin' })
        .then(r => r.ok ? r.json() : null)
        .then(user => {
          if (user && user.rol === 'admin') {
            atajos.forEach(a => a.style.display = '');
          }
        })
        .catch(() => {});
    });
  </script>
  <script src="../js/theme.js"></script>
  <script src="../js/config.js"></script>
  <script src="../js/dashboard-proteccion.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="../js/estadisticas.js?v=20251010"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>