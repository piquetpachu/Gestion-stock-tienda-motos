const API_URL = 'http://localhost/Gestion-stock-tienda-motos/app/';

document.addEventListener('DOMContentLoaded', () => {
  cargarResumen();
  cargarTopProductos();
});

async function cargarResumen() {
  const res = await fetch(API_URL + 'estadisticas');
  const data = await res.json();

  document.getElementById('gananciaHoy').textContent = `$${data.ganancia_hoy || 0}`;
  document.getElementById('gananciaMes').textContent = `$${data.ganancia_mes || 0}`;
  document.getElementById('gananciaAnio').textContent = `$${data.ganancia_anio || 0}`;
  document.getElementById('productoMasVendido').textContent = data.producto_mas_vendido || 'Sin datos';
}

async function cargarTopProductos() {
  const res = await fetch(API_URL + 'top_productos');
  const productos = await res.json();

  const nombres = productos.map(p => p.nombre);
  const cantidades = productos.map(p => p.cantidad);

  const ctx = document.getElementById('graficoTopProductos').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: nombres,
      datasets: [{
        label: 'Unidades vendidas',
        data: cantidades,
        backgroundColor: '#0d6efd',
        borderRadius: 8,
        barThickness: 40
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.parsed.y} ventas`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}
