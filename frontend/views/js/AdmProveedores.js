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

// ---------- Iconos SVG (inline, sin dependencias) ----------
const SVG_EDIT = `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
  </svg>`;
const SVG_TRASH = `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
  </svg>`;

// ---------- Util ----------
function normalizar(txt){ return (txt||'').toString().toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,''); }
function cmpNombre(a,b){ return normalizar(a.nombre).localeCompare(normalizar(b.nombre)); }
function cmpCuit(a,b){ return String(a.cuit||'').localeCompare(String(b.cuit||'')); }
// Muestra un guion cuando el campo está vacío, nulo o solo espacios
function mostrarGuion(v){
  if (v === null || v === undefined) return '-';
  const s = String(v).trim();
  return s.length ? s : '-';
}
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
      <button class="btn btn-warning btn-sm me-1" title="Editar" aria-label="Editar" onclick="editarProveedor(${p.id_proveedor})">${SVG_EDIT}</button>
      <button class="btn btn-danger btn-sm" title="Borrar" aria-label="Borrar" onclick="eliminarProveedor(${p.id_proveedor})">${SVG_TRASH}</button>
    ` : '';
    return `
      <tr data-prov-row="${p.id_proveedor}" data-prov-nombre="${p.nombre}">
        <td class="fw-semibold">${mostrarGuion(p.nombre)}</td>
        <td>${mostrarGuion(p.cuit)}</td>
        <td>${mostrarGuion(p.telefono)}</td>
        <td>${mostrarGuion(p.email)}</td>
        <td>${mostrarGuion(p.direccion)}</td>
        ${esAdminProv ? `<td class="acciones-col">${acciones}</td>` : ''}
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
    // Enviar CUIT solo dígitos al backend
    cuit: provCuit.value.replace(/\D/g, '').trim(),
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
  // Mostrar CUIT con máscara ##-########-# si hay datos
  provCuit.value = formatCUIT(p.cuit || '');
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

// ---------- Restricciones de entrada (solo números) ----------
function soloNumerosInput(e) {
  const cleaned = e.target.value.replace(/\D+/g, '');
  if (e.target.value !== cleaned) {
    const pos = e.target.selectionStart;
    e.target.value = cleaned;
    // Restaurar posición aproximada del cursor
    try { e.target.setSelectionRange(pos - 1, pos - 1); } catch {}
  }
}

// Formatear CUIT como en Ventas: ##-########-#
function formatCUIT(v){
  let s = (v ?? '').toString().replace(/\D/g,'');
  if (!s) return '';
  if (s.length > 11) s = s.slice(0,11);
  if (s.length > 2) s = s.slice(0,2) + '-' + s.slice(2);
  if (s.length > 11) s = s.slice(0,11) + '-' + s.slice(11);
  return s.length > 13 ? s.slice(0,13) : s;
}

function maskCUITInput(e){
  let val = e.target.value || '';
  // Dejar solo dígitos y guiones; luego aplicar máscara
  val = val.replace(/[^0-9\-]/g, '');
  // Reconstruir desde dígitos para evitar posiciones incorrectas
  const digits = val.replace(/\D/g,'').slice(0,11);
  let out = digits;
  if (out.length > 2) out = out.slice(0,2) + '-' + out.slice(2);
  if (out.length > 11) out = out.slice(0,11) + '-' + out.slice(11);
  if (out.length > 13) out = out.slice(0,13);
  e.target.value = out;
}

function isControlKey(e){
  return ['Backspace','Delete','Tab','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key) || (e.ctrlKey || e.metaKey);
}
function onlyDigitsKeydown(e){
  if (isControlKey(e)) return;
  if (/^\d$/.test(e.key)) return;
  e.preventDefault();
}
function sanitizeDigitsPaste(e){
  const data = (e.clipboardData || window.clipboardData)?.getData('text') || '';
  const digits = data.replace(/\D+/g,'');
  e.preventDefault();
  const el = e.target;
  const start = el.selectionStart; const end = el.selectionEnd;
  const before = el.value.slice(0,start);
  const after = el.value.slice(end);
  el.value = before + digits + after;
  const caret = (before + digits).length;
  try { el.setSelectionRange(caret, caret); } catch {}
  el.dispatchEvent(new Event('input', { bubbles:true }));
}

function onlyDigitsForCUITKeydown(e){
  if (isControlKey(e)) return;
  if (/^\d$/.test(e.key)) return;
  // No permitir escribir guiones manualmente; los agrega la máscara
  e.preventDefault();
}
function sanitizeCUITPaste(e){
  const data = (e.clipboardData || window.clipboardData)?.getData('text') || '';
  const digits = data.replace(/\D+/g,'').slice(0,11);
  e.preventDefault();
  const el = e.target;
  const start = el.selectionStart; const end = el.selectionEnd;
  const before = el.value.slice(0,start);
  const after = el.value.slice(end);
  let out = (before + digits + after).replace(/\D/g,'').slice(0,11);
  if (out.length > 2) out = out.slice(0,2) + '-' + out.slice(2);
  if (out.length > 11) out = out.slice(0,11) + '-' + out.slice(11);
  if (out.length > 13) out = out.slice(0,13);
  el.value = out;
  const caret = el.value.length;
  try { el.setSelectionRange(caret, caret); } catch {}
}

provCuit?.addEventListener('keydown', onlyDigitsForCUITKeydown);
provCuit?.addEventListener('paste', sanitizeCUITPaste);
provCuit?.addEventListener('input', maskCUITInput);
provTel?.addEventListener('keydown', onlyDigitsKeydown);
provTel?.addEventListener('paste', sanitizeDigitsPaste);
provTel?.addEventListener('input', soloNumerosInput);

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