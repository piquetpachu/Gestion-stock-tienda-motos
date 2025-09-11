// Mostrar/ocultar columna Acciones según el rol
fetch(API_URL+'usuario-info')
  .then(response => response.json())
  .then(data => {
    if (data.rol === 'admin') {
      document.getElementById('colAcciones').style.display = '';
      document.querySelectorAll('#tablaClientes td:last-child').forEach(td => td.style.display = '');
    } else {
      document.getElementById('colAcciones').style.display = 'none';
      document.querySelectorAll('#tablaClientes td:last-child').forEach(td => td.style.display = 'none');
    }
  });
    const form = document.getElementById('formCliente');
    const tabla = document.getElementById('tablaClientes');
    const paginacion = document.getElementById('paginacion');
    const busqueda = document.getElementById('busqueda');
    const ordenarPor = document.getElementById('ordenarPor');

    let clientes = [];
    let paginaActual = 1;
    const porPagina = 30;

let usuarioRol = null;

// Obtener el rol del usuario al cargar la página
fetch(API_URL+'usuario-info')
  .then(response => response.json())
  .then(data => {
    usuarioRol = data.rol;
    mostrarClientes(); // Actualiza la tabla si ya está cargada
  });

    document.addEventListener('DOMContentLoaded', () => {
      cargarClientes();
      busqueda.addEventListener('input', () => {
        paginaActual = 1;
        mostrarClientes();
      });
      ordenarPor.addEventListener('change', () => {
        paginaActual = 1;
        mostrarClientes();
      });
    });

    function cargarClientes() {
      fetch(API_URL + 'clientes')
        .then(res => res.json())
        .then(data => {
          clientes = data;
          mostrarClientes();
        });
    }

function mostrarClientes() {
  const filtro = busqueda.value.toLowerCase();
  const campoOrden = ordenarPor.value;

// Reemplaza el filtro actual en clientes.js por este:
const filtrados = clientes
  .filter(c => {
    const term = filtro.toLowerCase();
    return (
      (c.nombre && c.nombre.toLowerCase().includes(term)) ||
      (c.email && c.email.toLowerCase().includes(term)) ||
      (c.cuil_cuit && c.cuil_cuit.toString().toLowerCase().includes(term)) ||
      (c.telefono && c.telefono.toString().toLowerCase().includes(term)) ||
      (c.direccion && c.direccion.toLowerCase().includes(term)) ||
      (c.fecha_alta && c.fecha_alta.toLowerCase().includes(term))
    );
  })
    .sort((a, b) => {
      let A = a[campoOrden] || '', B = b[campoOrden] || '';
      if (typeof A === 'string') A = A.toLowerCase();
      if (typeof B === 'string') B = B.toLowerCase();
      return A > B ? 1 : A < B ? -1 : 0;
    });

  const totalPaginas = Math.ceil(filtrados.length / porPagina);
  const inicio = (paginaActual - 1) * porPagina;
  const clientesPagina = filtrados.slice(inicio, inicio + porPagina);

  tabla.innerHTML = clientesPagina.map(c => {
    let botones = '';
    let tdAcciones = '';
    if (usuarioRol === 'admin') {
      botones = `
        <button class="btn btn-warning btn-sm" onclick='editarCliente(${JSON.stringify(c)})'>✏️</button>
        <button class="btn btn-danger btn-sm" onclick='borrarCliente(${c.id_cliente})'>🗑️</button>
      `;
      tdAcciones = `<td>${botones}</td>`;
    } else {
      tdAcciones = `<td style='display:none'></td>`;
    }
    return `
      <tr>
        <td>${c.nombre} ${c.apellido || ''}</td>
        <td>${c.email}</td>
        <td>${c.telefono || '-'}</td>
        <td>${c.direccion || '-'}</td>
        <td>${c.cuil_cuit}</td>
        <td>${c.fecha_alta || '-'}</td>
        ${tdAcciones}
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
      mostrarClientes();
    }

    function nuevoCliente() {
      form.reset();
      document.getElementById('id_cliente').value = '';
      new bootstrap.Modal(document.getElementById('modalCliente')).show();
    }

    function editarCliente(cliente) {
      document.getElementById('id_cliente').value = cliente.id_cliente;
      document.getElementById('nombre').value = cliente.nombre;
      document.getElementById('apellido').value = cliente.apellido || '';
      document.getElementById('cuil_cuit').value = cliente.cuil_cuit;
      document.getElementById('cuil_cuit').value = cliente.cuil_cuit || '';
      document.getElementById('email').value = cliente.email;
      document.getElementById('telefono').value = cliente.telefono || '';
      document.getElementById('direccion').value = cliente.direccion || '';
      new bootstrap.Modal(document.getElementById('modalCliente')).show();
    }

    function borrarCliente(id) {
      if (!confirm('¿Eliminar cliente?')) return;
      fetch(API_URL + 'borrar_cliente/' + id, { method: 'DELETE' })
        .then(res => res.json())
        .then(() => cargarClientes());
    }

    // Evento de envío del formulario
    // Evento de envío del formulario
form.addEventListener('submit', e => {
    e.preventDefault();

    const datos = {
        id_cliente: document.getElementById('id_cliente').value,
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        // dni: document.getElementById('dni').value,
        cuil_cuit: document.getElementById('cuil_cuit').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        direccion: document.getElementById('direccion').value
    };

    // Validación básica
    if (!datos.nombre || !datos.cuil_cuit || !datos.email) {
        alert('Nombre, DNI y Email son campos requeridos');
        return;
    }

    const id = datos.id_cliente;
    const metodo = id ? 'PUT' : 'POST';
    const url = id ? API_URL + 'actualizar_cliente/' + id : API_URL + 'crear_cliente';

    fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    })
    .then(res => {
        if (!res.ok) {
            return res.json().then(err => { throw new Error(err.error || 'Error desconocido'); });
        }
        return res.json();
    })
    .then(resp => {
        bootstrap.Modal.getInstance(document.getElementById('modalCliente')).hide();
        form.reset();
        cargarClientes();
    })
    .catch(error => {
    if (error.message.includes('Duplicate entry') && error.message.includes('cuil_cuit')) {
      alert('El CUIL/CUIT ingresado ya está registrado. Por favor ingrese uno diferente.');
    } else {
      alert('Error: ' + error.message);
    }
    });
});
// Mostrar/ocultar botón de agregar según el rol
fetch(API_URL+'usuario-info')
  .then(response => response.json())
  .then(data => {
    if (data.rol === 'admin') {
      document.getElementById('btnAgregarCliente').style.display = 'block';
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