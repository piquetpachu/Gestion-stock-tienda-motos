// const API_URL = 'http://localhost/Gestion-stock-tienda-motos/app/';

document.addEventListener('DOMContentLoaded', () => {
  cargarResumen();
  cargarTopProductos();
  cargarVentasPorDia();
  cargarIngresosPorRubro();
  cargarStockBajoMinimo();
});

async function cargarResumen() {
  const res = await fetch(API_URL + 'estadisticas', { credentials: 'same-origin' });
  const data = await res.json();

  document.getElementById('gananciaHoy').textContent = `$${data.ganancia_hoy || 0}`;
  document.getElementById('gananciaMes').textContent = `$${data.ganancia_mes || 0}`;
  document.getElementById('gananciaAnio').textContent = `$${data.ganancia_anio || 0}`;
  document.getElementById('productoMasVendido').textContent = data.producto_mas_vendido || 'Sin datos';
}

async function cargarVentasPorDia() {
  try {
  const res = await fetch(API_URL + 'ventas_por_dia', { credentials: 'same-origin' });
  if (!res.ok) throw new Error(`HTTP ${res.status} al cargar ventas por día`);
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
  borderColor: getComputedStyle(document.documentElement).getPropertyValue('--bs-success').trim() || '#22c55e',
  backgroundColor: 'rgba(34,197,94,0.15)',
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
    const msg = document.getElementById('msgVentasPorDia');
    const canvas = document.getElementById('graficoVentasPorDia');
    if (msg && canvas) {
      msg.textContent = 'Error al cargar datos';
      canvas.style.display = 'none';
    }
  }
}

async function cargarIngresosPorRubro() {
  try {
  const res = await fetch(API_URL + 'ingresos_por_rubro', { credentials: 'same-origin' });
  if (!res.ok) throw new Error(`HTTP ${res.status} al cargar ingresos por rubro`);
    const filas = await res.json();
    const labels = Array.isArray(filas) ? filas.map(f => f.rubro || 'Sin rubro') : [];
    const datos = Array.isArray(filas) ? filas.map(f => Number(f.total || 0)) : [];
  const base = ['#1f6feb','#22c55e','#f59e0b','#ef4444','#0ea5e9','#8b5cf6','#14b8a6','#f43f5e','#84cc16','#6366f1'];
  const colores = labels.map((_,i) => base[i % base.length]);
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
    const msg = document.getElementById('msgIngresosPorRubro');
    const canvas = document.getElementById('graficoIngresosPorRubro');
    if (msg && canvas) {
      msg.textContent = 'Error al cargar datos';
      canvas.style.display = 'none';
    }
  }
}

async function cargarStockBajoMinimo(){
  try {
  const res = await fetch(API_URL + 'stock_bajo_minimo', { credentials: 'same-origin' });
  if (!res.ok) throw new Error(`HTTP ${res.status} al cargar stock bajo mínimo`);
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
    const tbody = document.getElementById('tbodyStockBajoMinimo');
    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Error al cargar</td></tr>';
    }
  }
}

async function cargarTopProductos() {
  const res = await fetch(API_URL + 'top_productos', { credentials: 'same-origin' });
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
  backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--bs-primary').trim() || '#1f6feb',
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
