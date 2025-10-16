<!DOCTYPE html>
<html lang="es" data-app-theme="light">
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

<div class="container page-container">
  <div id="alertRol" class="alert alert-warning d-none" role="alert"></div>
  <div class="page-card">
    <div class="card-body p-0">
      <h3 class="card-title mb-4 text-center text-primary fw-bold">
        <svg xmlns="http://www.w3.org/2000/svg" class="title-icon" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path d="M0 0h1v15H0zM3 8h1v7H3zM6 4h1v11H6zM9 11h1v4H9zM12 6h1v9h-1zM15 2h1v13h-1z"/>
        </svg>
        Estadísticas Generales
      </h3>

      <div class="row g-4">
        <!-- Tarjetas resumen -->
        <div class="col-md-3 col-sm-6">
          <div class="card stat-card stat-primary h-100">
            <div class="card-body">
              <h6 class="card-title fw-semibold">Ganancia Hoy</h6>
              <p class="h5 fw-bold mb-0" id="gananciaHoy">$0</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-sm-6">
          <div class="card stat-card stat-primary h-100">
            <div class="card-body">
              <h6 class="card-title fw-semibold">Ganancia del Mes</h6>
              <p class="h5 fw-bold mb-0" id="gananciaMes">$0</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-sm-6">
          <div class="card stat-card stat-primary h-100">
            <div class="card-body">
              <h6 class="card-title fw-semibold">Ganancia del Año</h6>
              <p class="h5 fw-bold mb-0" id="gananciaAnio">$0</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-sm-6">
          <div class="card stat-card stat-primary h-100">
            <div class="card-body">
              <h6 class="card-title fw-semibold">Más Vendido</h6>
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
                <h6 class="mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="title-icon" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                    <path d="M0 0h1v15H0zM2 14h14v1H2zM3 12l3-3 2 2 4-5 3 4v2l-3-4-4 5-2-2-3 3z"/>
                  </svg>
                  Ventas por día (año en curso)
                </h6>
                <div id="msgVentasPorDia" class="text-center text-secondary small">Cargando...</div>
                <canvas id="graficoVentasPorDia" height="140" style="display:none"></canvas>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="card h-100">
              <div class="card-body">
                <h6 class="mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="title-icon" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                    <path d="M2 2h12v2H2zM2 6h8v2H2zM2 10h10v2H2z"/>
                  </svg>
                  Ingresos por Rubro (año en curso)
                </h6>
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
                <h6 class="mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="title-icon" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                    <path d="M0 1h2l1 2h11l2 7H4L3 6H1zM5 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
                  </svg>
                  Productos Más Vendidos
                </h6>
                <canvas id="graficoTopProductos" height="160"></canvas>
              </div>
            </div>
          </div>
          <div class="col-lg-5">
            <div class="card h-100">
              <div class="card-body">
                <h6 class="mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="title-icon" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                    <path d="M3.75 0a1 1 0 0 0-.8.4L.1 4.2a.5.5 0 0 0-.1.3V15a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V4.5a.5.5 0 0 0-.1-.3L13.05.4a1 1 0 0 0-.8-.4zM15 4.667V5H1v-.333L1.5 4h6V1h1v3h6z"/>
                  </svg>
                  Stock bajo mínimo
                </h6>
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