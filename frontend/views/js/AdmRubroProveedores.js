(() => {
    if (typeof API_URL === 'undefined') {
        console.error('API_URL no definida. Define window.API_URL antes de este script.');
        return;
    }
    const API_BASE = API_URL.endsWith('/') ? API_URL : API_URL + '/';

    const API_RUBROS = API_BASE + 'rubros';
    const API_CREAR_RUBRO = API_BASE + 'crear_rubro';
    const API_BORRAR_RUBRO = id => API_BASE + 'borrar_rubro/' + id;
    const API_ACTUALIZAR_RUBRO = id => API_BASE + 'actualizar_rubro/' + id; // NUEVO

    const API_PROVEEDORES = API_BASE + 'proveedores';
    const API_CREAR_PROVEEDOR = API_BASE + 'crear_proveedor';
    const API_BORRAR_PROVEEDOR = id => API_BASE + 'borrar_proveedor/' + id;

    console.log('Endpoints:', {API_RUBROS, API_PROVEEDORES});

  // DOM
    const contRubros = document.getElementById('listaRubros');
    const formNuevoRubro = document.getElementById('form-nuevo-rubro-adm');
    const contProveedores = document.getElementById('listaProveedores');
    const formNuevoProveedor = document.getElementById('form-nuevo-proveedor-adm');

  // Cargar rubros
    async function cargarRubros() {
        if (contRubros) contRubros.innerHTML = '<div class="text-muted">Cargando rubros...</div>';
        try {
            const res = await fetch(API_RUBROS, { headers: { 'Accept': 'application/json' }});
            if (!res.ok) throw new Error('HTTP ' + res.status);
            let rubros = await safeJson(res);
            if (rubros && rubros.data && Array.isArray(rubros.data)) rubros = rubros.data;
            if (!Array.isArray(rubros)) rubros = [];
            renderRubros(rubros);
        } catch (err) {
            console.error('Error cargando rubros:', err);
            if (contRubros)
              contRubros.innerHTML = '<div class="text-danger">No se pudieron cargar los rubros.</div>';
        }
    }

    function renderRubros(rubros) {
        if (!contRubros) return;
        if (!rubros.length) {
            contRubros.innerHTML = `<div class="alert alert-secondary">No hay rubros registrados.</div>`;
            return;
        }
        contRubros.innerHTML = rubros
        .map(r => `
            <div class="card mb-2">
              <div class="card-body pt-2 pb-2">
                <div class="d-flex justify-content-between align-items-start">
                  <div class="me-2">
                    <h6 class="mb-1">${escapeHtml(r.nombre)}</h6>
                    <p class="card-text small text-muted mb-1">${r.descripcion ? escapeHtml(r.descripcion) : ''}</p>
                  </div>
                  <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-outline-primary" onclick="AdmRubroProveedores.toggleEditarRubro(${r.id_rubro})">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="AdmRubroProveedores.borrarRubro(${r.id_rubro})">Borrar</button>
                  </div>
                </div>
                <form id="rubro_form_edit_${r.id_rubro}" class="mt-2 d-none" onsubmit="return false;">
                  <div class="input-group input-group-sm">
                    <input id="rubro_nombre_edit_${r.id_rubro}" class="form-control" value="${escapeHtml(r.nombre)}" />
                    <button class="btn btn-success" type="button" onclick="AdmRubroProveedores.actualizarRubro(${r.id_rubro})">Guardar</button>
                    <button class="btn btn-outline-secondary" type="button" onclick="AdmRubroProveedores.toggleEditarRubro(${r.id_rubro})">Cancelar</button>
                  </div>
                </form>
              </div>
            </div>
        `).join('');
    }

  // CRUD rubro: crear
    if (formNuevoRubro) {
        formNuevoRubro.addEventListener('submit', async e => {
        e.preventDefault();
        const nombre = (formNuevoRubro.rubro_nombre.value || '').trim();
        if (!nombre) return alert('Ingrese nombre de rubro');
        try {
            const res = await fetch(API_CREAR_RUBRO, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre })
            });
        if (!res.ok) throw new Error('Error del servidor');
        await cargarRubros();
        formNuevoRubro.reset();
        } 
        catch (err) {
        console.error('Error creando rubro:', err);
        alert('No se pudo crear rubro.');
        }
    });
    }

    // borrar y actualizar rubro (actualizar simple haciendo PUT vía endpoint existente si lo hubiera)
    async function borrarRubro(id) {
        if (!confirm('¿Eliminar rubro?')) return;
        try {
            let res = await fetch(API_BORRAR_RUBRO(id), { method: 'DELETE' });
            if (!res.ok) {
                // Fallback si el servidor no acepta DELETE
                if (res.status === 405) {
                    res = await fetch(API_BORRAR_RUBRO(id), {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({_method:'DELETE'})
                    });
                }
            }
            if (!res.ok) throw new Error('Error al borrar');
            await cargarRubros();
        } catch (err) {
            console.error('Error borrando rubro:', err);
            alert('No se pudo borrar el rubro.');
        }
    }

    async function actualizarRubro(id) {
        const input = document.getElementById(`rubro_nombre_edit_${id}`);
        if (!input) return;
        const valor = input.value.trim();
        if (!valor) return alert('El nombre no puede quedar vacío');
        try {
            const res = await fetch(API_ACTUALIZAR_RUBRO(id), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre: valor })
            });
            if (!res.ok) {
                if (res.status === 405) {
                    // Fallback PUT -> POST
                    const res2 = await fetch(API_ACTUALIZAR_RUBRO(id), {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ nombre: valor, _method: 'PUT' })
                    });
                    if (!res2.ok) throw new Error('Error al actualizar (fallback)');
                } else {
                    throw new Error('Error al actualizar');
                }
            }
            await cargarRubros();
        } catch (err) {
            console.error('Error actualizando rubro:', err);
            alert('No se pudo actualizar el rubro.');
        }
    }

    // Proveedores
    async function cargarProveedores() {
        if (contProveedores) contProveedores.innerHTML = '<div class="text-muted">Cargando proveedores...</div>';
        try {
            const res = await fetch(API_PROVEEDORES, { headers: { 'Accept': 'application/json' }});
            if (!res.ok) throw new Error('HTTP ' + res.status);
            let proveedores = await safeJson(res);
            if (proveedores && proveedores.data && Array.isArray(proveedores.data)) proveedores = proveedores.data;
            if (!Array.isArray(proveedores)) proveedores = [];
            renderProveedores(proveedores);
        } catch (err) {
            console.error('Error cargando proveedores:', err);
            if (contProveedores)
              contProveedores.innerHTML = '<div class="text-danger">No se pudieron cargar los proveedores.</div>';
        }
    }

    function renderProveedores(items) {
        if (!contProveedores) return;
        if (!items.length) {
            contProveedores.innerHTML = `<div class="alert alert-secondary">No hay proveedores registrados.</div>`;
            return;
        }
        contProveedores.innerHTML = items.map(p => `
            <div class="d-flex justify-content-between align-items-center mb-2 border rounded p-2">
              <div class="me-2">
                <strong>${escapeHtml(p.nombre)}</strong><br/>
                <small class="text-muted">${p.email ? escapeHtml(p.email) : ''}${p.telefono ? ' • ' + escapeHtml(p.telefono) : ''}</small>
              </div>
              <div class="d-flex gap-2">
                <button class="btn btn-sm btn-danger" onclick="AdmRubroProveedores.borrarProveedor(${p.id_proveedor})">Borrar</button>
              </div>
            </div>
        `).join('');
    }

    if (formNuevoProveedor) {
        formNuevoProveedor.addEventListener('submit', async e => {
            e.preventDefault();
            const nombre = (formNuevoProveedor.proveedor_nombre.value || '').trim();
            const email = (formNuevoProveedor.proveedor_email.value || '').trim();
            if (!nombre) return alert('Ingrese nombre de proveedor');
            try {
                const res = await fetch(API_CREAR_PROVEEDOR, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify({ nombre, email })
                });
                if (!res.ok) throw new Error('Error del servidor');
                await cargarProveedores();
                formNuevoProveedor.reset();
            } catch (err) {
                console.error('Error creando proveedor:', err);
                alert('No se pudo crear proveedor.');
            }
        });
    }

    async function borrarProveedor(id) {
        if (!confirm('¿Eliminar proveedor?')) return;
        try {
            let res = await fetch(API_BORRAR_PROVEEDOR(id), { method: 'DELETE' });
            if (!res.ok && res.status === 405) {
                res = await fetch(API_BORRAR_PROVEEDOR(id), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({_method:'DELETE'})
                });
            }
            if (!res.ok) throw new Error('Error al borrar proveedor');
            await cargarProveedores();
        } catch (err) {
            console.error('Error borrando proveedor:', err);
            alert('No se pudo borrar el proveedor.');
        }
    }

    // util
    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    async function safeJson(res) {
        try { return await res.json(); } catch { return null; }
    }

    // Exponer funciones para botones inline
    window.AdmRubroProveedores = {
        borrarRubro,
        borrarProveedor,
        actualizarRubro,
        toggleEditarRubro: id => {
            const form = document.getElementById('rubro_form_edit_' + id);
            if (form) form.classList.toggle('d-none');
        }
    };

    // Inicialización
    function initAdm() {
        cargarRubros();
        cargarProveedores();
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAdm);
    } else {
        initAdm();
    }
})();