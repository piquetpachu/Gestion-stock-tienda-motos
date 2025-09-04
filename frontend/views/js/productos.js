// const API_URL = 'http://localhost/Gestion-stock-tienda-motos/app/';
const form = document.getElementById('formProducto');
const tabla = document.getElementById('tablaProductos');
const paginacion = document.getElementById('paginacion');
const busqueda = document.getElementById('busqueda');
const ordenarPor = document.getElementById('ordenarPor');

let productos = [];
let paginaActual = 1;
const porPagina = 30;

let usuarioRol = null;
// Obtener el rol del usuario al cargar la página
fetch(API_URL+'usuario-info')
  .then(response => response.json())
  .then(data => {
    usuarioRol = data.rol;
    mostrarProductos(); // Actualiza la tabla si ya está cargada
  });

document.addEventListener('DOMContentLoaded', () => {
  cargarProductos();
  cargarProveedores();
  cargarRubros();
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
    .filter(p => {
  const searchTerm = filtro.toLowerCase();
  return (
    p.nombre.toLowerCase().includes(searchTerm) ||
    (p.precio_venta && p.precio_venta.toString().includes(searchTerm)) ||
    (p.precio_compra && p.precio_compra.toString().includes(searchTerm)) ||
    (p.codigo_barras && p.codigo_barras.toString().toLowerCase().includes(searchTerm)) ||
    (p.fecha_alta && p.fecha_alta.toLowerCase().includes(searchTerm))
  );
})
    .sort((a, b) => {
      let A = a[campoOrden] || '', B = b[campoOrden] || '';
      if (typeof A === 'string') A = A.toLowerCase();
      if (typeof B === 'string') B = B.toLowerCase();
      return A > B ? 1 : A < B ? -1 : 0;
    });

  // Resto de la función permanece igual...
  const totalPaginas = Math.ceil(filtrados.length / porPagina);
  const inicio = (paginaActual - 1) * porPagina;
  const productosPagina = filtrados.slice(inicio, inicio + porPagina);

  tabla.innerHTML = productosPagina.map(p => {
    let botones = '';
    if (usuarioRol === 'admin') {
      botones = `
        <button class="btn btn-warning btn-sm" onclick='editar(${JSON.stringify(p)})'>✏️</button>
        <button class="btn btn-danger btn-sm" onclick='borrar(${p.id_producto})'>🗑️</button>
      `;
    }
    return `
      <tr>
        <td>${p.id_producto}</td>
        <td>${p.nombre}</td>
        <td>${p.descripcion || ''}</td>
        <td>${p.precio_venta || 0}</td>
        <td>${p.precio_compra || 0}</td>
        <td>${p.stock || 0}</td>
        <td>${p.stock_minimo || 0}</td>
        <td>${p.codigo_barras || ''}</td>
        <td>${p.fecha_alta || ''}</td>
        <td>${botones}</td>
      </tr>`;
  }).join('');

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

    if (document.getElementById('id_proveedor').tomselect) {
    document.getElementById('id_proveedor').tomselect.clear();
  }
  if (document.getElementById('id_rubro').tomselect) {
  document.getElementById('id_rubro').tomselect.clear();
}


  new bootstrap.Modal(document.getElementById('modalProducto')).show();
}

// Función para generar un código de barras EAN-13 válido
function generarCodigoBarras() {
  const base = Math.floor(Math.random() * 1e12).toString().padStart(12, '0');
  let suma = 0;
  for (let i = 0; i < 12; i++) {
    const num = parseInt(base[i]);
    suma += (i % 2 === 0) ? num : num * 3;
  }
  const digitoControl = (10 - (suma % 10)) % 10;
  return base + digitoControl;
}

// Evento de envío del formulario
form.addEventListener('submit', e => {
  e.preventDefault();

  const datos = {
    id_producto: document.getElementById('id_producto').value,
    nombre: document.getElementById('nombre').value,
    descripcion: document.getElementById('descripcion').value,
    precio_venta: parseFloat(document.getElementById('precio_venta').value) || 0,
    precio_compra: parseFloat(document.getElementById('precio_compra').value) || 0,
    stock: parseInt(document.getElementById('stock').value) || 0,
    id_proveedor: parseInt(document.getElementById('id_proveedor').value) || null,
    id_rubro: parseInt(document.getElementById('id_rubro').value) || null,
    // fecha_alta: document.getElementById('fecha_alta').value ,
    activo: document.getElementById('activo').checked ? 1 : 0,
    stock_minimo: parseInt(document.getElementById('stock_minimo').value) || 0,
    codigo_barras: document.getElementById('codigo_barras').value.trim()
  };

  // Si no se ingresó un código de barras, generar uno automático
  if (!datos.codigo_barras) {
    datos.codigo_barras = generarCodigoBarras();
  }
  

  const id = datos.id_producto;
  const metodo = id ? 'PUT' : 'POST';
  const url = id ? API_URL + 'actualizar_producto/' + id : API_URL + 'crear_producto';

  fetch(url, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  })
  .then(res => res.json())
  .then(resp => {
    if (resp.error) {
      alert('Error: ' + resp.error);
    } else {
      bootstrap.Modal.getInstance(document.getElementById('modalProducto')).hide();
      form.reset();
      cargarProductos();
    }
  });
});

async function cargarProveedores() {
  const select = document.getElementById('id_proveedor');
  select.innerHTML = '<option value="">Seleccione proveedor</option>';

  try {
    const res = await fetch(API_URL + 'proveedores');
    const proveedores = await res.json();

    proveedores.forEach(p => {
      const option = document.createElement('option');
      option.value = p.id_proveedor;
      option.textContent = p.nombre;
      select.appendChild(option);
    });

    // Activar Tom Select solo una vez (si no está inicializado ya)
    if (!select.tomselect) {
      new TomSelect('#id_proveedor', {
        placeholder: 'Seleccione proveedor',
        allowEmptyOption: true,
        maxOptions: 1000,
        closeAfterSelect: true,
        render: {
          no_results: () => '<div class="no-results">No se encontró ningún proveedor</div>',
        }
      });
    }

  } catch (error) {
    console.error('Error al cargar proveedores:', error);
  }
}

document.getElementById('form-nuevo-rubro').addEventListener('submit', async e => {
  e.preventDefault();
  const nombre = e.target.rubro_nombre.value;
  await fetch(API.replace('rubros', 'crear_rubro'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, descripcion })
  });
  e.target.reset();
  cargarRubros();
});

async function cargarRubros() {
  const select = document.getElementById('id_rubro');
  select.innerHTML = '<option value="">Seleccione rubro</option>';

  try {
    const res = await fetch(API_URL + 'rubros');
    const rubros = await res.json();

    rubros.forEach(r => {
      const option = document.createElement('option');
      option.value = r.id_rubro;
      option.textContent = r.nombre;
      select.appendChild(option);
    });

    // Inicializar Tom Select si no está ya
    if (!select.tomselect) {
      new TomSelect('#id_rubro', {
        placeholder: 'Seleccione rubro',
        allowEmptyOption: true,
        maxOptions: 500,
        closeAfterSelect: true
      });
    }

  } catch (error) {
    console.error('Error al cargar rubros:', error);
  }
}
fetch(API_URL+'usuario-info')
  .then(response => response.json())
  .then(data => {
    if (data.rol === 'admin') {
      document.getElementById('btnAgregarProducto').style.display = 'block';
    }
  });
  
  fetch(API_URL+'usuario-info')
  .then(response => response.json())
  .then(data => {
    if (data.rol === 'admin') {
      document.getElementById('colAcciones').style.display = '';
      document.querySelectorAll('#tablaProductos td:last-child').forEach(td => td.style.display = '');
    } else {
      document.getElementById('colAcciones').style.display = 'none';
      document.querySelectorAll('#tablaProductos td:last-child').forEach(td => td.style.display = 'none');
    }
  });
