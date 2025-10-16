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
const inputBuscarRubro = document.getElementById('buscarRubro');
const selectOrdenarRubro = document.getElementById('ordenarPorRubro');
const ulPaginacionRubros = document.getElementById('paginacionRubros');

// ---------- Estado ----------
let esAdmin = false;
let rubros = [];
let terminoBusquedaRubros = '';
let ordenarRubro = 'nombre_asc';
let paginaRubro = 1;
const PAGE_SIZE_RUBRO = 10;

// ---------- Util ----------
function normalizar(txt){ return (txt||'').toString().toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,''); }
function compararNombre(a, b){
  return normalizar(a.nombre).localeCompare(normalizar(b.nombre));
}
function filaVaciaRubros(msg='Sin rubros') {
  return `<tr><td colspan="${esAdmin?2:1}" class="text-center text-secondary">${msg}</td></tr>`;
}
function setTituloModalRubroNuevo() { tituloModalRubro.textContent = 'Nuevo Rubro'; }
function setTituloModalRubroEditar(r) {
  const nombre = (r?.nombre ?? '').trim() || '(sin nombre)';
  tituloModalRubro.textContent = `Editar Rubro: ${nombre}`;
}

// ---------- Render ----------
function aplicarFiltrosOrden(rubrosSrc){
  let lista = [...rubrosSrc];
  if (terminoBusquedaRubros) {
    const q = normalizar(terminoBusquedaRubros);
    lista = lista.filter(r => normalizar(r.nombre).includes(q));
  }
  if (ordenarRubro === 'nombre_asc') lista.sort(compararNombre);
  if (ordenarRubro === 'nombre_desc') lista.sort((a,b)=>-compararNombre(a,b));
  return lista;
}

function renderPaginacionRubros(total, pagina, pageSize){
  const totalPag = Math.max(1, Math.ceil(total / pageSize));
  paginaRubro = Math.min(pagina, totalPag);
  const li = [];
  const disabledPrev = paginaRubro === 1 ? 'disabled' : '';
  const disabledNext = paginaRubro === totalPag ? 'disabled' : '';
  li.push(`<li class="page-item ${disabledPrev}"><a class="page-link" href="#" data-page="${paginaRubro-1}">«</a></li>`);
  for (let p=1; p<=totalPag; p++){
    li.push(`<li class="page-item ${p===paginaRubro?'active':''}"><a class="page-link" href="#" data-page="${p}">${p}</a></li>`);
  }
  li.push(`<li class="page-item ${disabledNext}"><a class="page-link" href="#" data-page="${paginaRubro+1}">»</a></li>`);
  ulPaginacionRubros.innerHTML = li.join('');
  ulPaginacionRubros.querySelectorAll('a.page-link').forEach(a=>{
    a.addEventListener('click', e=>{
      e.preventDefault();
      const p = Number(a.dataset.page);
      if (!isNaN(p) && p>=1) {
        paginaRubro = p;
        renderRubros();
      }
    });
  });
}

function renderRubros() {
  const lista = aplicarFiltrosOrden(rubros);
  const total = lista.length;
  if (!total) {
    tbodyRubros.innerHTML = filaVaciaRubros(terminoBusquedaRubros ? 'Sin resultados' : 'Sin rubros');
    renderPaginacionRubros(0, 1, PAGE_SIZE_RUBRO);
    return;
  }
  const start = (paginaRubro-1)*PAGE_SIZE_RUBRO;
  const pageItems = lista.slice(start, start + PAGE_SIZE_RUBRO);

  tbodyRubros.innerHTML = pageItems.map(r => {
    const acciones = esAdmin ? `
      <button class="btn btn-warning btn-sm me-1" title="Editar" aria-label="Editar" onclick="editarRubro(${r.id_rubro})">✏️</button>
      <button class="btn btn-danger btn-sm" title="Borrar" aria-label="Borrar" onclick="eliminarRubro(${r.id_rubro})">🗑️</button>
    ` : '';
    return `
      <tr data-rubro-row="${r.id_rubro}">
        <td class="rubro-nombre">${r.nombre}</td>
        ${esAdmin ? `<td>${acciones}</td>` : ''}
      </tr>
    `;
  }).join('');

  // Click en fila (ignorando botones) para detalle
  tbodyRubros.querySelectorAll('tr[data-rubro-row]').forEach(tr => {
    tr.addEventListener('click', (e) => {
      if (e.target.closest('button')) return;
      const id = tr.getAttribute('data-rubro-row');
      mostrarProductosRubro(id);
    });
  });

  renderPaginacionRubros(total, paginaRubro, PAGE_SIZE_RUBRO);
}

// ---------- Buscador/Orden ----------
inputBuscarRubro?.addEventListener('input', (e) => {
  terminoBusquedaRubros = e.target.value.trim();
  paginaRubro = 1;
  renderRubros();
});
selectOrdenarRubro?.addEventListener('change', (e)=>{
  ordenarRubro = e.target.value;
  paginaRubro = 1;
  renderRubros();
});

// ---------- Modal ----------
document.getElementById('modalRubro').addEventListener('shown.bs.modal', () => {
  nombreRubroInput?.focus();
  nombreRubroInput?.select();
});
nombreRubroInput.addEventListener('input', () => {
  if (idRubroInput.value) setTituloModalRubroEditar({ nombre: nombreRubroInput.value });
});

// ---------- API ----------
async function cargarRubros() {
  try {
    const res = await fetch(API_URL + 'rubros');
    if (!res.ok) throw new Error('Error de servidor');
    rubros = await res.json();
    paginaRubro = 1;
    renderRubros();
  } catch {
    tbodyRubros.innerHTML = filaVaciaRubros('Error cargando');
    renderPaginacionRubros(0, 1, PAGE_SIZE_RUBRO);
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
      renderPaginacionRubros(0, 1, PAGE_SIZE_RUBRO);
    });
})();

// ---- Productos por Rubro ----
const modalProductosRubro = new bootstrap.Modal(document.getElementById('modalProductosRubro'));
const tbodyProdPorRubro = document.getElementById('tbodyProdPorRubro');
const tituloProductosRubro = document.getElementById('tituloProductosRubro');

async function mostrarProductosRubro(idRubro){
  const rubro = rubros.find(r => String(r.id_rubro) === String(idRubro));
  tituloProductosRubro.textContent = `Productos del Rubro: ${rubro?.nombre || ''}`;
  tbodyProdPorRubro.innerHTML = '<tr><td colspan="5" class="text-center text-secondary">Cargando...</td></tr>';
  modalProductosRubro.show();
  try {
    // Reutilizamos endpoint de productos y filtramos client-side (si fuera muy grande convendría endpoint dedicado)
    const res = await fetch(API_URL + 'productos');
    if (!res.ok) throw new Error('Error obteniendo productos');
    const productos = await res.json();
    const filtrados = productos.filter(p => String(p.id_rubro) === String(idRubro));
    if (!filtrados.length){
      tbodyProdPorRubro.innerHTML = '<tr><td colspan="5" class="text-center text-secondary">Sin productos</td></tr>';
      return;
    }
    tbodyProdPorRubro.innerHTML = filtrados.map(p => `
      <tr>
        <td>${p.nombre || ''}</td>
        <td>${p.descripcion || ''}</td>
        <td>${p.precio_venta ?? ''}</td>
        <td>${p.stock ?? ''}</td>
        <td>${p.codigo_barras || ''}</td>
      </tr>
    `).join('');
  } catch (e) {
    tbodyProdPorRubro.innerHTML = `<tr><td colspan="5" class="text-center text-danger">${e.message}</td></tr>`;
  }
}