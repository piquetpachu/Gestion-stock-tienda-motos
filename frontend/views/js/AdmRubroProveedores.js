(() => {
    const API_RUBROS = API_URL + 'rubros';
    const API_CREAR_RUBRO = API_URL + 'crear_rubro';
    const API_BORRAR_RUBRO = id => API_URL + 'borrar_rubro/' + id;

    const API_PROVEEDORES = API_URL + 'proveedores';
    const API_CREAR_PROVEEDOR = API_URL + 'crear_proveedor';
    const API_BORRAR_PROVEEDOR = id => API_URL + 'borrar_proveedor/' + id;

  // DOM
    const contRubros = document.getElementById('listaRubros');
    const formNuevoRubro = document.getElementById('form-nuevo-rubro-adm');
    const contProveedores = document.getElementById('listaProveedores');
    const formNuevoProveedor = document.getElementById('form-nuevo-proveedor-adm');

  // Cargar rubros
    async function cargarRubros() {
        try {
            const res = await fetch(API_RUBROS);
            const rubros = await res.json();
            renderRubros(rubros || []);
        } 
        catch (err) {
            console.error('Error cargando rubros:', err);
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
    .map(
        r => `
    <div class="card mb-2">
        <div class="card-body d-flex justify-content-between align-items-start">
            <div>
            <h5 class="card-title mb-1">${escapeHtml(r.nombre)}</h5>
            <p class="card-text small text-muted">${r.descripcion || ''}</p>
            <div class="mt-1">
            <button class="btn btn-sm btn-outline-primary" onclick="document.getElementById('rubro_nombre_edit_${r.id_rubro}').classList.toggle('d-none')">Editar</button>
            <button class="btn btn-sm btn-danger" onclick="AdmRubroProveedores.borrarRubro(${r.id_rubro})">Borrar</button>
        </div>
        <form id="rubro_form_edit_${r.id_rubro}" class="mt-2 d-none" onsubmit="return false;">
            <div class="input-group">
                <input id="rubro_nombre_edit_${r.id_rubro}" class="form-control" value="${escapeHtml(r.nombre)}" />
                <button class="btn btn-success" type="button" onclick="AdmRubroProveedores.actualizarRubro(${r.id_rubro})">Guardar</button>
            </div>
            </form>
        </div>
    </div>
    </div>
    `
        )
        .join('');
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
        const res = await fetch(API_BORRAR_RUBRO(id), { method: 'DELETE' });
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
        const res = await fetch(API_URL + 'actualizar_rubro/' + id, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: valor })
        });
        if (!res.ok) throw new Error('Error al actualizar');
        await cargarRubros();
        } catch (err) {
        console.error('Error actualizando rubro:', err);
        alert('No se pudo actualizar el rubro.');
        }
    }

    // Proveedores
    async function cargarProveedores() {
        try {
        const res = await fetch(API_PROVEEDORES);
        const proveedores = await res.json();
        renderProveedores(proveedores || []);
        } catch (err) {
        console.error('Error cargando proveedores:', err);
        contProveedores.innerHTML = '<div class="text-danger">No se pudieron cargar los proveedores.</div>';
        }
    }

    function renderProveedores(items) {
        if (!contProveedores) return;
        if (!items.length) {
        contProveedores.innerHTML = `<div class="alert alert-secondary">No hay proveedores registrados.</div>`;
        return;
        }
        contProveedores.innerHTML = items
        .map(
            p => `
        <div class="d-flex justify-content-between align-items-center mb-2 border rounded p-2">
        <div>
            <strong>${escapeHtml(p.nombre)}</strong><br/>
            <small class="text-muted">${p.email || ''} ${p.telefono ? '• ' + escapeHtml(p.telefono) : ''}</small>
        </div>
        <div>
            <button class="btn btn-sm btn-danger" onclick="AdmRubroProveedores.borrarProveedor(${p.id_proveedor})">Borrar</button>
        </div>
        </div>
        `
        )
        .join('');
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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, email, telefono: formNuevoProveedor.proveedor_telefono?.value })
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
        const res = await fetch(API_BORRAR_PROVEEDOR(id), { method: 'DELETE' });
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

    // Exponer funciones para botones inline
    window.AdmRubroProveedores = {
        borrarRubro,
        borrarProveedor,
        actualizarRubro
    };

    // Inicialización
    document.addEventListener('DOMContentLoaded', () => {
        cargarRubros();
        cargarProveedores(); // reutiliza mismo endpoint que [`cargarProveedores`](frontend/views/js/productos.js)
    });
})();