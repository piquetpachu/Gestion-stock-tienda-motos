const API_URL = 'http://localhost/Gestion-stock-tienda-motos/app/';
const form = document.getElementById('formProducto');
const tabla = document.getElementById('tablaProductos');
const paginacion = document.getElementById('paginacion');
const busqueda = document.getElementById('busqueda');
const ordenarPor = document.getElementById('ordenarPor');

let productos = [];
let paginaActual = 1;
const porPagina = 30;

document.addEventListener('DOMContentLoaded', () => {
  cargarProductos();
  busqueda.addEventListener('input', () => {
    paginaActual = 1;
    mostrarProductos();
  });
  ordenarPor.addEventListener('change', () => {
    paginaActual = 1;
    mostrarProductos();
  });
});

function cargarProductos() {
  fetch(API_URL + 'productos')
    .then(res => res.json())
    .then(data => {
      productos = data;
      mostrarProductos();
    });
}

function mostrarProductos() {
  const filtro = busqueda.value.toLowerCase();
  const campoOrden = ordenarPor.value;

  const filtrados = productos
    .filter(p => p.nombre.toLowerCase().includes(filtro))
    .sort((a, b) => {
      let A = a[campoOrden] || '', B = b[campoOrden] || '';
      if (typeof A === 'string') A = A.toLowerCase();
      if (typeof B === 'string') B = B.toLowerCase();
      return A > B ? 1 : A < B ? -1 : 0;
    });

  const totalPaginas = Math.ceil(filtrados.length / porPagina);
  const inicio = (paginaActual - 1) * porPagina;
  const productosPagina = filtrados.slice(inicio, inicio + porPagina);

  tabla.innerHTML = productosPagina.map(p => `
    <tr>
      <td>${p.id_producto}</td>
      <td>${p.nombre}</td>
      <td>${p.descripcion || ''}</td>
      <td>${p.precio_venta || 0}</td>
      <td>${p.precio_compra || 0}</td>
      <td>${p.stock || 0}</td>
      <td>${p.stock_minimo || 0}</td>
      <td>${p.codigo_barras || p.codigo_barras || ''}</td>
      <td>${p.fecha_alta || ''}</td>
      <td>
        <button class="btn btn-warning btn-sm" onclick='editar(${JSON.stringify(p)})'>✏️</button>
        <button class="btn btn-danger btn-sm" onclick='borrar(${p.id_producto})'>🗑️</button>
      </td>
    </tr>`).join('');

  paginacion.innerHTML = '';
  for (let i = 1; i <= totalPaginas; i++) {
    paginacion.innerHTML += `
      <li class="page-item ${i === paginaActual ? 'active' : ''}">
        <button class="page-link" onclick="cambiarPagina(${i})">${i}</button>
      </li>`;
  }
}

function cambiarPagina(n) {
  paginaActual = n;
  mostrarProductos();
}

function editar(p) {
  const campos = [
    'id_producto', 'nombre', 'descripcion', 'precio_venta',
    'precio_compra', 'stock', 'stock_minimo',
    'codigo_barras', 'fecha_alta', 'id_proveedor', 'id_rubro', 'activo'
  ];
  campos.forEach(campo => {
    if (document.getElementById(campo))
      document.getElementById(campo).value = p[campo] ?? '';
  });
  new bootstrap.Modal(document.getElementById('modalProducto')).show();
}

function borrar(id) {
  if (!confirm('¿Eliminar producto?')) return;
  fetch(API_URL + 'borrar_producto/' + id, { method: 'DELETE' })
    .then(res => res.json())
    .then(() => cargarProductos());
}

function nuevoProducto() {
  form.reset();
  document.getElementById('id_producto').value = '';
  document.getElementById('fecha_alta').value = new Date().toISOString().split('T')[0];
  new bootstrap.Modal(document.getElementById('modalProducto')).show();
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const datos = {
    nombre: document.getElementById('nombre').value,
    descripcion: document.getElementById('descripcion').value,
    precio_venta: parseFloat(document.getElementById('precio_venta').value) || 0,
    precio_compra: parseFloat(document.getElementById('precio_compra').value) || 0,
    stock: parseInt(document.getElementById('stock').value) || 0,
    stock_minimo: parseInt(document.getElementById('stock_minimo').value) || 0,
    codigo_barras: document.getElementById('codigo_barras').value,
    fecha_alta: document.getElementById('fecha_alta').value,
    id_proveedor: parseInt(document.getElementById('id_proveedor').value) || null,
    id_rubro: parseInt(document.getElementById('id_rubro').value) || null,
    activo: document.getElementById('activo').value
  };
  const id = document.getElementById('id_producto').value;
  const metodo = id ? 'PUT' : 'POST';
  const url = id ? API_URL + 'actualizar_producto/' + id : API_URL + 'crear_producto';

  fetch(url, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  })
    .then(res => res.json())
    .then(() => {
      bootstrap.Modal.getInstance(document.getElementById('modalProducto')).hide();
      form.reset();
      cargarProductos();
    });
});
