// Gestión Rubros y Proveedores unificada

// ---------- Referencias Rubros ----------
const tbodyRubros = document.getElementById('tbodyRubros');
const btnNuevoRubro = document.getElementById('btnNuevoRubro');
const thAccionesRubros = document.getElementById('thAccionesRubros');
const modalRubro = new bootstrap.Modal(document.getElementById('modalRubro'));
const formRubro = document.getElementById('formRubro');
const idRubroInput = document.getElementById('id_rubro');
const nombreRubroInput = document.getElementById('nombre_rubro');
const tituloModalRubro = document.getElementById('tituloModalRubro');

// ---------- Referencias Proveedores ----------
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
let rubros = [];
let proveedores = [];

// ---------- Util ----------
function filaVaciaRubros(msg='Sin rubros') {
  return `<tr><td colspan="${esAdmin?3:2}" class="text-center text-secondary">${msg}</td></tr>`;
}
function filaVaciaProveedores(msg='Sin proveedores') {
  return `<tr><td colspan="${esAdmin?4:3}" class="text-center text-secondary">${msg}</td></tr>`;
}

// ---------- Render Rubros ----------
function renderRubros() {
  if (!rubros.length) {
    tbodyRubros.innerHTML = filaVaciaRubros();
    return;
  }
  tbodyRubros.innerHTML = rubros.map(r => {
    const acciones = esAdmin ? `
      <button class="btn btn-sm btn-warning me-1" onclick="editarRubro(${r.id_rubro})">Editar</button>
      <button class="btn btn-sm btn-danger" onclick="eliminarRubro(${r.id_rubro})">Borrar</button>
    ` : '';
    return `
      <tr>
        <td>${r.id_rubro}</td>
        <td>${r.nombre}</td>
        ${esAdmin ? `<td>${acciones}</td>` : ''}
      </tr>
    `;
  }).join('');
}

// ---------- Render Proveedores ----------
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

// ---------- Carga desde API ----------
async function cargarRubros() {
  try {
    const res = await fetch(API_URL + 'rubros');
    if (!res.ok) throw new Error();
    rubros = await res.json();
    renderRubros();
  } catch {
    tbodyRubros.innerHTML = filaVaciaRubros('Error cargando');
  }
}

async function cargarProveedores() {
  try {
    const res = await fetch(API_URL + 'proveedores');
    if (!res.ok) throw new Error();
    proveedores = await res.json();
    renderProveedores();
  } catch {
    tbodyProveedores.innerHTML = filaVaciaProveedores('Error cargando');
  }
}

// ---------- CRUD Rubro ----------
formRubro.addEventListener('submit', async e => {
  e.preventDefault();
  const id = idRubroInput.value.trim();
  const payload = { nombre: nombreRubroInput.value.trim() };
  if (!payload.nombre) return;
  const url = id ? (API_URL + 'actualizar_rubro/' + id) : (API_URL + 'crear_rubro');
  const method = id ? 'PUT' : 'POST';
  try {
    const res = await fetch(url, {
      method,
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok || data.error) throw new Error(data.error||'Error');
    modalRubro.hide();
    await cargarRubros();
  } catch(err){
    alert('Error Rubro: '+err.message);
  }
});

window.editarRubro = id => {
  const r = rubros.find(x=>x.id_rubro==id);
  if(!r) return;
  idRubroInput.value = r.id_rubro;
  nombreRubroInput.value = r.nombre;
  tituloModalRubro.textContent = 'Editar Rubro';
  modalRubro.show();
};

window.eliminarRubro = async id => {
  if(!confirm('¿Eliminar rubro?')) return;
  try{
    const res = await fetch(API_URL + 'borrar_rubro/' + id, { method:'DELETE' });
    const data = await res.json();
    if(!res.ok || data.error) throw new Error(data.error||'Error');
    await cargarRubros();
  }catch(e){
    alert('Error: '+e.message);
  }
};

btnNuevoRubro.addEventListener('click', () => {
  idRubroInput.value = '';
  formRubro.reset();
  tituloModalRubro.textContent = 'Nuevo Rubro';
  modalRubro.show();
});

// ---------- CRUD Proveedor ----------
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
        btnNuevoRubro.classList.remove('d-none');
        thAccionesRubros.style.display = '';
        btnNuevoProveedor.classList.remove('d-none');
        thAccionesProveedores.style.display = '';
      }
      cargarRubros();
      cargarProveedores();
    })
    .catch(() => {
      tbodyRubros.innerHTML = filaVaciaRubros('No autenticado');
      tbodyProveedores.innerHTML = filaVaciaProveedores('No autenticado');
    });
})();