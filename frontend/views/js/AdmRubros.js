// Gestión de Rubros

// ---------- Referencias ----------
const tbodyRubros = document.getElementById('tbodyRubros');
const btnNuevoRubro = document.getElementById('btnNuevoRubro');
const thAccionesRubros = document.getElementById('thAccionesRubros');
const modalRubro = new bootstrap.Modal(document.getElementById('modalRubro'));
const formRubro = document.getElementById('formRubro');
const idRubroInput = document.getElementById('id_rubro');
const nombreRubroInput = document.getElementById('nombre_rubro');
const tituloModalRubro = document.getElementById('tituloModalRubro');

// Helpers de título
function setTituloModalRubroNuevo() {
  tituloModalRubro.textContent = 'Nuevo Rubro';
}
function setTituloModalRubroEditar(r) {
  const nombre = (r?.nombre ?? '').trim() || '(sin nombre)';
  const id = r?.id_rubro ?? idRubroInput.value;
  tituloModalRubro.textContent = `Editar Rubro: ${nombre} (ID ${id})`;
}

// Auto-focus al abrir el modal
document.getElementById('modalRubro').addEventListener('shown.bs.modal', () => {
  nombreRubroInput?.focus();
  nombreRubroInput?.select();
});

// Refrescar título mientras se escribe (solo en modo editar)
nombreRubroInput.addEventListener('input', () => {
  if (idRubroInput.value) {
    setTituloModalRubroEditar({ nombre: nombreRubroInput.value, id_rubro: idRubroInput.value });
  }
});

// ---------- Estado ----------
let esAdmin = false;
let rubros = [];

// ---------- Util ----------
function filaVaciaRubros(msg='Sin rubros') {
  return `<tr><td colspan="${esAdmin?2:1}" class="text-center text-secondary">${msg}</td></tr>`;
}

// ---------- Render ----------
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
        <td>${r.nombre}</td>
        ${esAdmin ? `<td>${acciones}</td>` : ''}
      </tr>
    `;
  }).join('');
}

// ---------- API ----------
async function cargarRubros() {
  try {
    const res = await fetch(API_URL + 'rubros');
    if (!res.ok) throw new Error('Error de servidor');
    rubros = await res.json();
    renderRubros();
  } catch {
    tbodyRubros.innerHTML = filaVaciaRubros('Error cargando');
  }
}

// ---------- CRUD ----------
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
  setTituloModalRubroEditar(r);
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
  setTituloModalRubroNuevo();
  modalRubro.show();
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
      }
      cargarRubros();
    })
    .catch(() => {
      tbodyRubros.innerHTML = filaVaciaRubros('No autenticado');
    });
})();