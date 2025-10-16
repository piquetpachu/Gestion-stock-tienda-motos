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
const inputBuscarProveedor = document.getElementById('buscarProveedor');
const selectOrdenarProveedor = document.getElementById('ordenarPorProveedor');
const ulPaginacionProveedores = document.getElementById('paginacionProveedores');

// ---------- Estado ----------
let esAdminProv = false;
let proveedores = [];
let terminoBusquedaProv = '';
let ordenarProv = 'nombre_asc';
let paginaProv = 1;
const PAGE_SIZE_PROV = 10;

// ---------- Util ----------
function normalizar(txt){ return (txt||'').toString().toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,''); }
function cmpNombre(a,b){ return normalizar(a.nombre).localeCompare(normalizar(b.nombre)); }
function cmpCuit(a,b){ return String(a.cuit||'').localeCompare(String(b.cuit||'')); }
function filaVaciaProveedores(msg='Sin proveedores') {
  // Columnas visibles: Nombre, CUIT, Teléfono, Email, Dirección (+ Acciones si admin)
  const baseCols = 5;
  return `<tr><td colspan="${esAdminProv ? baseCols + 1 : baseCols}" class="text-center text-secondary">${msg}</td></tr>`;
}

// ---------- Render ----------
function aplicarFiltrosOrdenProv(src){
  let lista = [...src];
  if (terminoBusquedaProv){
    const q = normalizar(terminoBusquedaProv);
    lista = lista.filter(p =>
      normalizar(p.nombre).includes(q) ||
      normalizar(p.cuit).includes(q) ||
      normalizar(p.telefono).includes(q) ||
      normalizar(p.email).includes(q) ||
      normalizar(p.direccion).includes(q)
    );
  }
  if (ordenarProv === 'nombre_asc') lista.sort(cmpNombre);
  if (ordenarProv === 'nombre_desc') lista.sort((a,b)=>-cmpNombre(a,b));
  if (ordenarProv === 'cuit_asc') lista.sort(cmpCuit);
  if (ordenarProv === 'cuit_desc') lista.sort((a,b)=>-cmpCuit(a,b));
  return lista;
}

function renderPaginacionProveedores(total, pagina, pageSize){
  const totalPag = Math.max(1, Math.ceil(total / pageSize));
  paginaProv = Math.min(pagina, totalPag);
  const li = [];
  const disabledPrev = paginaProv === 1 ? 'disabled' : '';
  const disabledNext = paginaProv === totalPag ? 'disabled' : '';
  li.push(`<li class="page-item ${disabledPrev}"><a class="page-link" href="#" data-page="${paginaProv-1}">«</a></li>`);
  for (let p=1; p<=totalPag; p++){
    li.push(`<li class="page-item ${p===paginaProv?'active':''}"><a class="page-link" href="#" data-page="${p}">${p}</a></li>`);
  }
  li.push(`<li class="page-item ${disabledNext}"><a class="page-link" href="#" data-page="${paginaProv+1}">»</a></li>`);
  ulPaginacionProveedores.innerHTML = li.join('');
  ulPaginacionProveedores.querySelectorAll('a.page-link').forEach(a=>{
    a.addEventListener('click', e=>{
      e.preventDefault();
      const p = Number(a.dataset.page);
      if (!isNaN(p) && p>=1) {
        paginaProv = p;
        renderProveedores();
      }
    });
  });
}

function renderProveedores() {
  const lista = aplicarFiltrosOrdenProv(proveedores);
  const total = lista.length;
  if (!total) {
    tbodyProveedores.innerHTML = filaVaciaProveedores(terminoBusquedaProv ? 'Sin resultados' : 'Sin proveedores');
    renderPaginacionProveedores(0, 1, PAGE_SIZE_PROV);
    return;
  }
  const start = (paginaProv-1)*PAGE_SIZE_PROV;
  const pageItems = lista.slice(start, start + PAGE_SIZE_PROV);

  tbodyProveedores.innerHTML = pageItems.map(p => {
    const acciones = esAdminProv ? `
      <button class="btn btn-sm btn-warning me-1" onclick="editarProveedor(${p.id_proveedor})">Editar</button>
      <button class="btn btn-sm btn-danger" onclick="eliminarProveedor(${p.id_proveedor})">Borrar</button>
    ` : '';
    return `
      <tr data-prov-row="${p.id_proveedor}" data-prov-nombre="${p.nombre}">
        <td class="fw-semibold">${p.nombre}</td>
        <td>${p.cuit || ''}</td>
        <td>${p.telefono || ''}</td>
        <td>${p.email || ''}</td>
        <td>${p.direccion || ''}</td>
        ${esAdminProv ? `<td>${acciones}</td>` : ''}
      </tr>
    `;
  }).join('');

  // Asignar eventos a los nombres de proveedores para abrir modal de productos
  // Click en fila (ignorando botones) para ver productos del proveedor
  tbodyProveedores.querySelectorAll('tr[data-prov-row]').forEach(tr => {
    tr.addEventListener('click', (e) => {
      const target = e.target;
      if (target.closest('button')) return; // ignorar botones acciones
      const id = tr.getAttribute('data-prov-row');
      const nombre = tr.getAttribute('data-prov-nombre') || 'Proveedor';
      mostrarProductosDeProveedor(id, nombre);
    });
  });

  renderPaginacionProveedores(total, paginaProv, PAGE_SIZE_PROV);
}

// ---------- Buscador/Orden ----------
inputBuscarProveedor?.addEventListener('input', (e) => {
  terminoBusquedaProv = e.target.value.trim();
  paginaProv = 1;
  renderProveedores();
});
selectOrdenarProveedor?.addEventListener('change', (e)=>{
  ordenarProv = e.target.value;
  paginaProv = 1;
  renderProveedores();
});

// ---------- Modal ----------
document.getElementById('modalProveedor').addEventListener('shown.bs.modal', () => {
  provNombre?.focus();
  provNombre?.select();
});

// ---------- API ----------
async function cargarProveedores() {
  try {
    const res = await fetch(API_URL + 'proveedores');
    if (!res.ok) throw new Error('Error de servidor');
    proveedores = await res.json();
    paginaProv = 1;
    renderProveedores();
  } catch {
    tbodyProveedores.innerHTML = filaVaciaProveedores('Error cargando');
    renderPaginacionProveedores(0, 1, PAGE_SIZE_PROV);
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
  tituloModalProveedor.textContent = `Editar Proveedor: ${p.nombre || '(sin nombre)'}`;
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
      esAdminProv = u.rol === 'admin';
      if (esAdminProv){
        btnNuevoProveedor.classList.remove('d-none');
        thAccionesProveedores.style.display = '';
      }
      cargarProveedores();
    })
    .catch(() => {
      tbodyProveedores.innerHTML = filaVaciaProveedores('No autenticado');
      renderPaginacionProveedores(0, 1, PAGE_SIZE_PROV);
    });
})();

// ---- Productos por proveedor ----
const modalProductosProveedor = new bootstrap.Modal(document.getElementById('modalProductosProveedor'));
const tbodyProdPorProveedor = document.getElementById('tbodyProdPorProveedor');
const tituloModalProductosProveedor = document.getElementById('tituloModalProductosProveedor');

async function mostrarProductosDeProveedor(idProveedor, nombreProveedor){
  tituloModalProductosProveedor.textContent = `Productos de ${nombreProveedor}`;
  tbodyProdPorProveedor.innerHTML = '<tr><td colspan="5" class="text-center text-secondary">Cargando...</td></tr>';
  modalProductosProveedor.show();
  try{
    const res = await fetch(API_URL + 'productos_por_proveedor/' + idProveedor);
    if(!res.ok) throw new Error('Error del servidor');
    const items = await res.json();
    if(!items || !items.length){
      tbodyProdPorProveedor.innerHTML = '<tr><td colspan="5" class="text-center text-secondary">Sin productos</td></tr>';
      return;
    }
    tbodyProdPorProveedor.innerHTML = items.map(it => `
      <tr>
        <td>${it.nombre || ''}</td>
        <td>${it.descripcion || ''}</td>
        <td>${it.precio_venta ?? ''}</td>
        <td>${it.stock ?? ''}</td>
        <td>${it.codigo_barras || ''}</td>
      </tr>
    `).join('');
  }catch(err){
    tbodyProdPorProveedor.innerHTML = `<tr><td colspan="5" class="text-center text-danger">${err.message}</td></tr>`;
  }
}

// Eliminado modal de detalle independiente (redundante)