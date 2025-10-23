// clientes.js - versión robusta con guardado en localStorage
(function(){
  const STORAGE_KEY = 'formCliente';

  // Esperar a que el DOM esté listo
  document.addEventListener('DOMContentLoaded', () => {
    // Elementos (pueden ser null si tu HTML no tiene alguno; lo manejamos)
  const form = document.getElementById('form_cliente');
    const tabla = document.getElementById('tablaClientes');
    const paginacion = document.getElementById('paginacion');
    const busqueda = document.getElementById('busqueda');
    const ordenarPor = document.getElementById('ordenarPor');
    const modalEl = document.getElementById('modalCliente');

    if (!form) console.warn('clientes.js: no se encontró #formCliente en el DOM.');
    if (!modalEl) console.warn('clientes.js: no se encontró #modalCliente en el DOM.');

    // Variables de estado
    let clientes = [];
    let paginaActual = 1;
    const porPagina = 30;
    let usuarioRol = null;

    // Iconos SVG inline para acciones
    const SVG_EDIT = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
      </svg>`;
    const SVG_TRASH = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
      </svg>`;
    // Formateo seguro para mostrar valores en la UI
    function fmt(v, fallback = '-') {
      if (v === null || v === undefined) return fallback;
      if (typeof v === 'string') {
        const s = v.trim();
        if (!s || s.toLowerCase() === 'null' || s.toLowerCase() === 'undefined') return fallback;
        return s;
      }
      return String(v);
    }

    // Para inputs: convertir null/"null"/vacíos en cadena vacía
    function toInput(v) {
      const s = fmt(v, '');
      return s;
    }

    // Helpers para localStorage
    function saveFormToStorage(formEl, key) {
      if (!formEl) return;
      const datos = {};
      Array.from(formEl.elements).forEach(el => {
        if (!el.id) return;
        if (el.type === 'checkbox') datos[el.id] = el.checked;
        else datos[el.id] = el.value;
      });
      try {
        localStorage.setItem(key, JSON.stringify(datos));
        console.log('clientes.js: formulario guardado en localStorage');
      } catch (e) {
        console.error('clientes.js: error guardando en localStorage', e);
      }
    }

    function restoreFormFromStorage(formEl, key) {
      if (!formEl) return false;
      const raw = localStorage.getItem(key);
      if (!raw) return false;
      try {
        const datos = JSON.parse(raw);
        Object.keys(datos).forEach(k => {
          const el = document.getElementById(k);
          if (!el) return;
          if (el.type === 'checkbox') el.checked = !!datos[k];
          else el.value = datos[k];
        });
        console.log('clientes.js: formulario restaurado desde localStorage');
        return true;
      } catch (e) {
        console.error('clientes.js: error restaurando desde localStorage', e);
        return false;
      }
    }

    // Restricciones de entrada: Teléfono solo números
    function soloNumerosInput(e) {
      const cleaned = (e.target.value || '').replace(/\D+/g, '');
      if (e.target.value !== cleaned) {
        const pos = e.target.selectionStart || 0;
        e.target.value = cleaned;
        try { e.target.setSelectionRange(pos - 1, pos - 1); } catch {}
      }
    }
    function isControlKey(e){
      return ['Backspace','Delete','Tab','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key) || (e.ctrlKey || e.metaKey);
    }
    function onlyDigitsKeydown(e){
      if (isControlKey(e)) return;
      if (/^\d$/.test(e.key)) return;
      // Evitar escribir letras u otros símbolos
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
      // Disparar limpieza por si quedó algo
      el.dispatchEvent(new Event('input', { bubbles:true }));
    }
    // CUIT/CUIL con máscara como en Ventas: ##-########-#
    function maskCUITInput(e){
      let val = (e.target.value || '').replace(/[^0-9\-]/g,'');
      const digits = val.replace(/\D/g,'').slice(0,11);
      let out = digits;
      if (out.length > 2) out = out.slice(0,2) + '-' + out.slice(2);
      if (out.length > 11) out = out.slice(0,11) + '-' + out.slice(11);
      if (out.length > 13) out = out.slice(0,13);
      e.target.value = out;
    }
    // Formateo de CUIT para mostrar (tabla/detalle)
    function formatCUITStr(v){
      let s = (v ?? '').toString().replace(/\D/g,'');
      if (!s) return '';
      s = s.slice(0,11);
      if (s.length > 2) s = s.slice(0,2) + '-' + s.slice(2);
      if (s.length > 11) s = s.slice(0,11) + '-' + s.slice(11);
      if (s.length > 13) s = s.slice(0,13);
      return s;
    }
    function onlyDigitsForCUITKeydown(e){
      if (isControlKey(e)) return;
      // Permitimos solo dígitos; los guiones los agrega la máscara
      if (/^\d$/.test(e.key)) return;
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
      let out = before + digits + after;
      // aplicar máscara sobre el resultado completo
      out = out.replace(/\D/g,'').slice(0,11);
      if (out.length > 2) out = out.slice(0,2) + '-' + out.slice(2);
      if (out.length > 11) out = out.slice(0,11) + '-' + out.slice(11);
      if (out.length > 13) out = out.slice(0,13);
      el.value = out;
      const caret = el.value.length;
      try { el.setSelectionRange(caret, caret); } catch {}
    }

  const cuilInput = document.getElementById('cliente_cuit');
    cuilInput?.addEventListener('keydown', onlyDigitsForCUITKeydown);
    cuilInput?.addEventListener('paste', sanitizeCUITPaste);
    cuilInput?.addEventListener('input', maskCUITInput);

  const telInput = document.getElementById('cliente_telefono');
    telInput?.addEventListener('keydown', onlyDigitsKeydown);
    telInput?.addEventListener('paste', sanitizeDigitsPaste);
    telInput?.addEventListener('input', soloNumerosInput);

    // API: mostrar/ocultar UI según rol
    fetch(API_URL + 'usuario-info')
      .then(r => r.json())
      .then(data => {
        usuarioRol = data.rol;
        if (usuarioRol === 'admin') {
          const btn = document.getElementById('btnAgregarCliente');
          if (btn) btn.style.display = 'block';
          const colAcc = document.getElementById('colAcciones');
          if (colAcc) colAcc.style.display = '';
        } else {
          const colAcc = document.getElementById('colAcciones');
          if (colAcc) colAcc.style.display = 'none';
        }
        mostrarClientes();
      })
      .catch(err => console.warn('clientes.js: error usuario-info', err));

    // Cargar clientes
    function cargarClientes() {
      fetch(API_URL + 'clientes')
        .then(res => res.json())
        .then(data => {
          clientes = data || [];
          mostrarClientes();
        })
        .catch(err => console.error('clientes.js: error cargando clientes', err));
    }

function mostrarClientes() {
  if (!tabla) return;
  const filtro = (busqueda?.value || '').toLowerCase();
  const campoOrden = ordenarPor?.value || '';

  const filtrados = (clientes || [])
    .filter(c => {
      const term = filtro;
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
      if (!campoOrden) return 0;
      let A = a[campoOrden] || '', B = b[campoOrden] || '';
      if (typeof A === 'string') A = A.toLowerCase();
      if (typeof B === 'string') B = B.toLowerCase();
      return A > B ? 1 : A < B ? -1 : 0;
    });

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / porPagina));
  const inicio = (paginaActual - 1) * porPagina;
  const clientesPagina = filtrados.slice(inicio, inicio + porPagina);

  // 🔹 renderizamos las filas
  tabla.innerHTML = clientesPagina.map(c => {
    let botones = '';
    let tdAcciones = '';
    if (usuarioRol === 'admin') {
      botones = `
        <button class="btn btn-warning btn-sm" title="Editar" aria-label="Editar" onclick='editarCliente(${JSON.stringify(c)})'>${SVG_EDIT}</button>
        <button class="btn btn-danger btn-sm" title="Eliminar" aria-label="Eliminar" onclick='borrarCliente(${c.id_cliente})'>${SVG_TRASH}</button>
      `;
      tdAcciones = `<td class="acciones-col">${botones}</td>`;
    } else {
      tdAcciones = `<td style='display:none'></td>`;
    }

    const nombreCompleto = fmt([c.nombre, c.apellido].filter(Boolean).join(' ').trim());

    return `
      <tr data-id="${c.id_cliente}">
        <td>${nombreCompleto}</td>
        <td>${fmt(c.email)}</td>
        <td>${fmt(c.telefono)}</td>
        <td>${fmt(c.direccion)}</td>
  <td>${fmt(formatCUITStr(c.cuil_cuit))}</td>
        <td>${fmt(c.fecha_alta)}</td>
        ${tdAcciones}
      </tr>`;
  }).join(''); // 👈 Esto es lo que faltaba
  

  // 🔹 paginación
  if (paginacion) {
    paginacion.innerHTML = '';
    for (let i = 1; i <= totalPaginas; i++) {
      paginacion.innerHTML += `
        <li class="page-item ${i === paginaActual ? 'active' : ''}">
          <button class="page-link" onclick="cambiarPagina(${i})">${i}</button>
        </li>`;
    }
  }
}

    // Exponer cambiarPagina a window (se usa desde HTML generado)
    window.cambiarPagina = function(n) {
      paginaActual = n;
      mostrarClientes();
    };

    // Nuevo cliente: restaurar si hay datos
    window.nuevoCliente = function() {
      if (form) form.reset();
      const idInput = document.getElementById('id_cliente');
      if (idInput) idInput.value = '';
      restoreFormFromStorage(form, STORAGE_KEY);
      new bootstrap.Modal(document.getElementById('modalCliente')).show();
    };

    // Editar cliente: limpiar storage y cargar datos en form
    window.editarCliente = function(cliente) {
      localStorage.removeItem(STORAGE_KEY);
      if (form) {
        if (document.getElementById('id_cliente')) document.getElementById('id_cliente').value = cliente.id_cliente;
        if (document.getElementById('cliente_nombre')) document.getElementById('cliente_nombre').value = toInput(cliente.nombre);
        if (document.getElementById('cliente_apellido')) document.getElementById('cliente_apellido').value = toInput(cliente.apellido);
        if (document.getElementById('cliente_cuit')) {
          const raw = toInput(cliente.cuil_cuit);
          const digits = String(raw||'').replace(/\D/g,'');
          let out = digits;
          if (out.length > 2) out = out.slice(0,2) + '-' + out.slice(2);
          if (out.length > 11) out = out.slice(0,11) + '-' + out.slice(11);
          if (out.length > 13) out = out.slice(0,13);
          document.getElementById('cliente_cuit').value = out;
        }
        if (document.getElementById('cliente_email')) document.getElementById('cliente_email').value = toInput(cliente.email);
        if (document.getElementById('cliente_telefono')) document.getElementById('cliente_telefono').value = toInput(cliente.telefono);
        if (document.getElementById('cliente_direccion')) document.getElementById('cliente_direccion').value = toInput(cliente.direccion);
      }
      new bootstrap.Modal(document.getElementById('modalCliente')).show();
    };

    // Borrar cliente
window.borrarCliente = function(id) {
  if (!confirm('¿Eliminar cliente?')) return;

  fetch(API_URL + 'borrar_cliente/' + id, { method: 'DELETE' })
    .then(async res => {
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        // Si el backend devuelve error, lo mostramos
        const msg = data.error || 'No se pudo eliminar el cliente.';
        // alert('⚠️ ' + msg);
        throw new Error(msg);
      }
      return data;
    })
    .then(() => {
      alert('✅ Cliente eliminado correctamente.');
      cargarClientes();
    })
    .catch(err => {
      // Si el servidor no pudo borrar (FK constraint)
      if (err.message.includes('foreign key') || err.message.includes('1451')) {
        alert('❌ No se puede eliminar este cliente porque tiene ventas asociadas.');
      } else {
        console.error('clientes.js: error borrando cliente', err);
        alert('❌ Error al eliminar cliente.');
      }
    });
};


    // Attach submit handler (si existe el form)
    // Soportar ambos: submit del form y click en botón Guardar (como en Ventas)
    function handleGuardar(e){
        e.preventDefault();
        const datos = {
          id_cliente: document.getElementById('id_cliente')?.value || '',
          nombre: document.getElementById('cliente_nombre')?.value || '',
          apellido: document.getElementById('cliente_apellido')?.value || '',
          // Enviar solo dígitos al backend
          cuil_cuit: (document.getElementById('cliente_cuit')?.value || '').replace(/\D/g,''),
          email: document.getElementById('cliente_email')?.value || '',
          telefono: document.getElementById('cliente_telefono')?.value || '',
          direccion: document.getElementById('cliente_direccion')?.value || ''
        };

        if (!datos.nombre || !datos.cuil_cuit || !datos.email) {
          alert('Nombre, CUIL/CUIT y Email son campos requeridos');
          return;
        }
        // Validar longitud CUIT/CUIL (11 dígitos)
        if (datos.cuil_cuit.length !== 11) {
          alert('El CUIL/CUIT debe tener 11 dígitos');
          return;
        }

        const id = datos.id_cliente;
        const metodo = id ? 'PUT' : 'POST';
        const url = id ? API_URL + 'actualizar_cliente/' + id : API_URL + 'crear_cliente';

        // remove storage because we're about to save
        localStorage.removeItem(STORAGE_KEY);

        fetch(url, {
          method: metodo,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datos)
        })
        .then(res => {
          if (!res.ok) return res.json().then(err => { throw new Error(err.error || 'Error desconocido'); });
          return res.json();
        })
        .then(() => {
          bootstrap.Modal.getInstance(document.getElementById('modalCliente'))?.hide();
          form.reset();
          localStorage.removeItem(STORAGE_KEY); // limpiar datos guardados
          cargarClientes();
        })
        .catch(error => {
          if (error.message.includes('Duplicate entry') && error.message.includes('cuil_cuit')) {
            alert('El CUIL/CUIT ingresado ya está registrado.');
          } else {
            alert('Error: ' + error.message);
          }
        });
    }
    if (form) form.addEventListener('submit', handleGuardar);
    document.getElementById('guardar_cliente')?.addEventListener('click', handleGuardar);

    // Guardar al cerrar modal (solo si es nuevo)
    if (modalEl) {
      modalEl.addEventListener('hide.bs.modal', () => {
        const idVal = document.getElementById('id_cliente')?.value;
        if (!idVal && form) saveFormToStorage(form, STORAGE_KEY);
      });
    }

    // Botón Vaciar (solo una vez)
    (function ensureVaciarButton(){
      const footer = document.querySelector('#modalCliente .modal-footer');
      if (!footer) return;
      if (document.getElementById('btnVaciarCliente')) return; // ya existe
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.id = 'btnVaciarCliente';
      btn.className = 'btn btn-danger';
      btn.textContent = 'Vaciar';
      btn.onclick = function() {
        if (form) form.reset();
        localStorage.removeItem(STORAGE_KEY);
      };
      footer.appendChild(btn);
    })();

    // Listeners para filtros y orden (si existen)
    if (busqueda) busqueda.addEventListener('input', () => { paginaActual = 1; mostrarClientes(); });
    if (ordenarPor) ordenarPor.addEventListener('change', () => { paginaActual = 1; mostrarClientes(); });

    // Inicializar carga
    cargarClientes();
// === Mostrar detalles al hacer clic en una fila ===
if (tabla) {
  tabla.addEventListener('click', (e) => {
    if (e.target.closest('button')) return;
    const fila = e.target.closest('tr');
    if (!fila) return;

    const id = fila.dataset.id;
    if (!id) return;

    const cliente = clientes.find(c => String(c.id_cliente) === String(id));
    if (!cliente) return;

    const detalleHTML = `
      <ul class="list-group list-group-flush">
        <li class="list-group-item"><b>Nombre y Apellido:</b> ${fmt([cliente.nombre, cliente.apellido].filter(Boolean).join(' ').trim())}</li>
        <li class="list-group-item"><b>Email:</b> ${fmt(cliente.email)}</li>
        <li class="list-group-item"><b>Teléfono:</b> ${fmt(cliente.telefono)}</li>
        <li class="list-group-item"><b>Dirección:</b> ${fmt(cliente.direccion)}</li>
  <li class="list-group-item"><b>CUIL/CUIT:</b> ${fmt(formatCUITStr(cliente.cuil_cuit))}</li>
        <li class="list-group-item"><b>Fecha de Alta:</b> ${fmt(cliente.fecha_alta)}</li>
      </ul>
    `;

    document.getElementById('detalleCliente').innerHTML = detalleHTML;
    document.getElementById('modalDetallesClienteLabel').textContent = `Detalles de ${fmt(cliente.nombre, 'Cliente')}`;
    new bootstrap.Modal(document.getElementById('modalDetallesCliente')).show();
  });
}



  }); // DOMContentLoaded
})();
