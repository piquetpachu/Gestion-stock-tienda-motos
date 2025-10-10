// const API_URL = 'http://localhost/Gestion-stock-tienda-motos/app/';

document.addEventListener('DOMContentLoaded', () => {
  cargarResumen();
  cargarTopProductos();
  cargarVentasPorDia();
  cargarIngresosPorRubro();
  cargarStockBajoMinimo();
});

async function cargarResumen() {
  const res = await fetch(API_URL + 'estadisticas');
  const data = await res.json();

  document.getElementById('gananciaHoy').textContent = `$${data.ganancia_hoy || 0}`;
  document.getElementById('gananciaMes').textContent = `$${data.ganancia_mes || 0}`;
  document.getElementById('gananciaAnio').textContent = `$${data.ganancia_anio || 0}`;
  document.getElementById('productoMasVendido').textContent = data.producto_mas_vendido || 'Sin datos';
}

async function cargarVentasPorDia() {
  try {
    const res = await fetch(API_URL + 'ventas_por_dia');
    if (!res.ok) throw new Error('Error al cargar ventas por día');
    const filas = await res.json();
    const labels = Array.isArray(filas) ? filas.map(f => f.dia) : [];
    const datos = Array.isArray(filas) ? filas.map(f => Number(f.total || 0)) : [];
    const msg = document.getElementById('msgVentasPorDia');
    const canvas = document.getElementById('graficoVentasPorDia');
    if (!labels.length) {
      msg.textContent = 'Sin datos en el período';
      canvas.style.display = 'none';
      return;
    }
    msg.style.display = 'none';
    canvas.style.display = '';
    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Ventas ($)',
        data: datos,
        borderColor: '#198754',
        backgroundColor: 'rgba(25,135,84,0.15)',
        tension: 0.25,
        fill: true,
        pointRadius: 2
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true }
      }
    }
    });
  } catch (e) {
    console.error(e);
  }
}

async function cargarIngresosPorRubro() {
  try {
    const res = await fetch(API_URL + 'ingresos_por_rubro');
    if (!res.ok) throw new Error('Error al cargar ingresos por rubro');
    const filas = await res.json();
    const labels = Array.isArray(filas) ? filas.map(f => f.rubro || 'Sin rubro') : [];
    const datos = Array.isArray(filas) ? filas.map(f => Number(f.total || 0)) : [];
    const colores = labels.map((_,i) => `hsl(${(i*47)%360} 70% 55%)`);
    const msg = document.getElementById('msgIngresosPorRubro');
    const canvas = document.getElementById('graficoIngresosPorRubro');
    if (!labels.length) {
      msg.textContent = 'Sin datos en el período';
      canvas.style.display = 'none';
      return;
    }
    msg.style.display = 'none';
    canvas.style.display = '';
    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
      type: 'doughnut',
      data: { labels, datasets: [{ data: datos, backgroundColor: colores }] },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: { callbacks: { label: c => ` $${c.parsed}` } }
        },
        cutout: '55%'
      }
    });
  } catch (e) {
    console.error(e);
  }
}

async function cargarStockBajoMinimo(){
  try {
    const res = await fetch(API_URL + 'stock_bajo_minimo');
    if (!res.ok) throw new Error('Error al cargar stock bajo mínimo');
    const filas = await res.json();
    const tbody = document.getElementById('tbodyStockBajoMinimo');
    if (!filas || !filas.length){
      tbody.innerHTML = '<tr><td colspan="4" class="text-center text-secondary">Sin alertas</td></tr>';
      return;
    }
    tbody.innerHTML = filas.map(f => `
    <tr>
      <td>${f.nombre}</td>
      <td>${f.rubro}</td>
      <td class="text-end">${f.stock}</td>
      <td class="text-end">${f.stock_minimo}</td>
    </tr>
    `).join('');
  } catch (e) {
    console.error(e);
  }
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
