// Gestión de Proveedores

// ---------- Referencias ----------
const tbodyProveedores = document.getElementById('tbodyProveedores');
const btnNuevoProveedor = document.getElementById('btnNuevoProveedor');
const thAccionesProveedores = document.getElementById('thAccionesProveedores');
const modalProveedor = new bootstrap.Modal(document.getElementById('modalProveedor'));
const formProveedor = document.getElementById('formProveedor');
const idProveedorInput = document.getElementById('id_proveedor');
const provNombre = document.getElementById('prov_nombre');
const provCuit = document.getElementById('prov_cuit');
const provTel = document.getElementById('prov_telefono');
const provEmail = document.getElementById('prov_email');
const provDir = document.getElementById('prov_direccion');
const tituloModalProveedor = document.getElementById('tituloModalProveedor');

// ---------- Estado ----------
let esAdmin = false;
let proveedores = [];

// ---------- Util ----------
function filaVaciaProveedores(msg='Sin proveedores') {
  return `<tr><td colspan="${esAdmin?4:3}" class="text-center text-secondary">${msg}</td></tr>`;
}

// ---------- Render ----------
function renderProveedores() {
  if (!proveedores.length) {
    tbodyProveedores.innerHTML = filaVaciaProveedores();
    return;
  }
  tbodyProveedores.innerHTML = proveedores.map(p => {
    const acciones = esAdmin ? `
      <button class="btn btn-sm btn-warning me-1" onclick="editarProveedor(${p.id_proveedor})">Editar</button>
      <button class="btn btn-sm btn-danger" onclick="eliminarProveedor(${p.id_proveedor})">Borrar</button>
    ` : '';
    return `
      <tr>
        <td>${p.id_proveedor}</td>
        <td>${p.nombre}</td>
        <td>${p.cuit || ''}</td>
        ${esAdmin ? `<td>${acciones}</td>` : ''}
      </tr>
    `;
  }).join('');
}

// ---------- API ----------
async function cargarProveedores() {
  try {
    const res = await fetch(API_URL + 'proveedores');
    if (!res.ok) throw new Error('Error de servidor');
    proveedores = await res.json();
    renderProveedores();
  } catch {
    tbodyProveedores.innerHTML = filaVaciaProveedores('Error cargando');
  }
}

// ---------- CRUD ----------
formProveedor.addEventListener('submit', async e => {
  e.preventDefault();
  const id = idProveedorInput.value.trim();
  const payload = {
    nombre: provNombre.value.trim(),
    cuit: provCuit.value.trim(),
    telefono: provTel.value.trim(),
    email: provEmail.value.trim(),
    direccion: provDir.value.trim()
  };
  if (!payload.nombre) return;

  const url = id ? (API_URL + 'actualizar_proveedor/' + id) : (API_URL + 'crear_proveedor');
  const method = id ? 'PUT':'POST';

  try {
    const res = await fetch(url, {
      method,
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if(!res.ok || data.error) throw new Error(data.error||'Error');
    modalProveedor.hide();
    await cargarProveedores();
  } catch(err){
    alert('Error Proveedor: '+err.message);
  }
});

window.editarProveedor = id => {
  const p = proveedores.find(x=>x.id_proveedor==id);
  if(!p) return;
  idProveedorInput.value = p.id_proveedor;
  provNombre.value = p.nombre || '';
  provCuit.value = p.cuit || '';
  provTel.value = p.telefono || '';
  provEmail.value = p.email || '';
  provDir.value = p.direccion || '';
  tituloModalProveedor.textContent = 'Editar Proveedor';
  modalProveedor.show();
};

window.eliminarProveedor = async id => {
  if(!confirm('¿Eliminar proveedor?')) return;
  try{
    const res = await fetch(API_URL + 'borrar_proveedor/' + id, { method:'DELETE' });
    const data = await res.json();
    if(!res.ok || data.error) throw new Error(data.error||'Error');
    await cargarProveedores();
  }catch(e){
    alert('Error: '+e.message);
  }
};

btnNuevoProveedor.addEventListener('click', () => {
  idProveedorInput.value = '';
  formProveedor.reset();
  tituloModalProveedor.textContent = 'Nuevo Proveedor';
  modalProveedor.show();
});

// ---------- Init ----------
(function init(){
  fetch(API_URL + 'usuario-info')
    .then(r=>r.json())
    .then(u=>{
      esAdmin = u.rol === 'admin';
      if (esAdmin){
        btnNuevoProveedor.classList.remove('d-none');
        thAccionesProveedores.style.display = '';
      }
      cargarProveedores();
    })
    .catch(() => {
      tbodyProveedores.innerHTML = filaVaciaProveedores('No autenticado');
    });
})();