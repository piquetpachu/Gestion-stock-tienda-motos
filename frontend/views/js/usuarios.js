// usuarios.js - versión con localStorage (sin contraseña) y protección admin
document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'formUsuario';

  const formUsuario = document.getElementById('formUsuario');
  const modalUsuarioEl = document.getElementById('modalUsuario');
  const btnAgregarUsuario = document.getElementById('btnAgregarUsuario');
  const tablaUsuarios = document.getElementById('tablaUsuarios');
  let justSaved = false;

  // -----------------------------------
  // Helpers localStorage / UI
  // -----------------------------------
  function saveFormToStorage() {
    if (!formUsuario) return;
    const datos = {};
    Array.from(formUsuario.elements).forEach(el => {
      if (!el.id || el.id === 'usuario_contrasena') return; // 🚫 no guardamos contraseña
      if (el.type === 'checkbox') datos[el.id] = el.checked;
      else datos[el.id] = el.value;
    });
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(datos)); } catch(e){ console.warn('localStorage error', e); }
  }

  function restoreFormFromStorage() {
    if (!formUsuario) return false;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    try {
      const datos = JSON.parse(raw);
      Object.keys(datos).forEach(k => {
        if (k === 'usuario_contrasena') return; // 🚫 nunca restauramos contraseña
        const el = document.getElementById(k);
        if (!el) return;
        if (el.type === 'checkbox') el.checked = !!datos[k];
        else el.value = datos[k];
      });
      // siempre aseguramos que la contraseña esté vacía
      const passInput = document.getElementById('usuario_contrasena');
      if (passInput) passInput.value = '';
      return true;
    } catch(e){
      console.error('restore error', e);
      return false;
    }
  }

  function clearStorageAndForm() {
    if (formUsuario) formUsuario.reset();
    localStorage.removeItem(STORAGE_KEY);
    const idInput = document.getElementById('usuario_id');
    if (idInput) idInput.value = '';
    const adv = document.getElementById('pass-warning');
    if (adv) adv.style.display = 'none';
  }

  function mostrarError(mensaje) {
    const modalBody = modalUsuarioEl?.querySelector('.modal-body');
    if (!modalBody) { alert(mensaje); return; }
    let alertDiv = modalBody.querySelector('#user-alert');
    if (!alertDiv) {
      alertDiv = document.createElement('div');
      alertDiv.id = 'user-alert';
      alertDiv.className = 'alert alert-danger';
      modalBody.prepend(alertDiv);
    }
    alertDiv.textContent = mensaje;
  }

  // -----------------------------------
  // Verificación admin
  // -----------------------------------
  async function verificarAdmin() {
    try {
      const res = await fetch('/Gestion-stock-tienda-motos/app/usuario-info');
      if (!res.ok) return false;
      const user = await res.json();
      if (user.rol !== 'admin') {
        const adminAlert = document.getElementById('admin-alert');
        if (adminAlert) {
          adminAlert.textContent = 'Acceso solo para administradores.';
          adminAlert.classList.remove('d-none');
        }
        const panel = document.getElementById('usuarios-panel');
        if (panel) panel.style.display = 'none';
        return false;
      }
      return true;
    } catch (e) {
      console.warn('verificarAdmin error', e);
      return false;
    }
  }

  // -----------------------------------
  // CRUD: listar, crear/actualizar, borrar
  // -----------------------------------
  async function cargarUsuarios() {
    try {
      const res = await fetch('/Gestion-stock-tienda-motos/app/usuarios');
      if (!res.ok) throw new Error('No se pudieron cargar usuarios');
      const usuarios = await res.json();
      if (!tablaUsuarios) return;
      tablaUsuarios.innerHTML = '';
      usuarios.forEach(u => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${u.id_usuario}</td>
          <td>${u.nombre}</td>
          <td>${u.email}</td>
          <td>${u.rol}</td>
          <td>
            <button class="btn btn-warning btn-sm" onclick="editarUsuario(${u.id_usuario})">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="eliminarUsuario(${u.id_usuario})">Eliminar</button>
          </td>`;
        tablaUsuarios.appendChild(tr);
      });
    } catch (e) {
      console.error(e);
      mostrarError('Error cargando usuarios');
    }
  }

  // Guardar (crear/actualizar)
  if (formUsuario) {
    formUsuario.addEventListener('submit', async function (ev) {
      ev.preventDefault();
      if (!confirm('¿Está seguro que desea guardar estos datos?')) return;

      const datos = {
        nombre: document.getElementById('usuario_nombre')?.value || '',
        email: document.getElementById('usuario_email')?.value || '',
        rol: document.getElementById('usuario_rol')?.value || '',
        contrasena: document.getElementById('usuario_contrasena')?.value || ''
      };
      const id = document.getElementById('usuario_id')?.value || '';
      try {
        const url = id ? `/Gestion-stock-tienda-motos/app/actualizar_usuario/${id}` : '/Gestion-stock-tienda-motos/app/registrar_usuario';
        const metodo = id ? 'PUT' : 'POST';
        const res = await fetch(url, {
          method: metodo,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datos)
        });
        if (!res.ok) {
          let text = 'Error al guardar usuario';
          try { const json = await res.json(); if (json && json.error) text = json.error; } catch {}
          throw new Error(text);
        }
        await cargarUsuarios();
        justSaved = true;
        bootstrap.Modal.getInstance(modalUsuarioEl)?.hide();
      } catch (err) {
        console.error(err);
        mostrarError(err.message || 'Error al guardar usuario');
      }
    });
  }

  // Botón Agregar
  if (btnAgregarUsuario) {
    btnAgregarUsuario.addEventListener('click', () => {
      const idInput = document.getElementById('usuario_id');
      if (idInput) idInput.value = '';
      const restored = restoreFormFromStorage();
      if (!restored && formUsuario) formUsuario.reset();
      bootstrap.Modal.getOrCreateInstance(modalUsuarioEl).show();
    });
  }

  // Editar (expuesto en window)
  window.editarUsuario = async function (id) {
    try {
      localStorage.removeItem(STORAGE_KEY);
      const res = await fetch(`/Gestion-stock-tienda-motos/app/usuario/${id}`);
      if (!res.ok) throw new Error('No se encontró usuario');
      const usuario = await res.json();
      document.getElementById('usuario_id').value = usuario.id_usuario || '';
      document.getElementById('usuario_nombre').value = usuario.nombre || '';
      document.getElementById('usuario_email').value = usuario.email || '';
      document.getElementById('usuario_rol').value = usuario.rol || '';
      document.getElementById('usuario_contrasena').value = '';

      const resInfo = await fetch('/Gestion-stock-tienda-motos/app/usuario-info');
      const user = resInfo.ok ? await resInfo.json() : null;
      const rolSel = document.getElementById('usuario_rol');
      if (rolSel) rolSel.disabled = (user && user.id === usuario.id_usuario);

      const adv = document.getElementById('pass-warning');
      if (adv) adv.style.display = 'none';

      bootstrap.Modal.getOrCreateInstance(modalUsuarioEl).show();
    } catch (e) {
      console.error(e);
      mostrarError('Error al cargar datos del usuario');
    }
  };

  // Eliminar (expuesto en window)
  window.eliminarUsuario = async function (id) {
    try {
      const resUser = await fetch('/Gestion-stock-tienda-motos/app/usuario-info');
      const user = resUser.ok ? await resUser.json() : null;
      if (user && user.id === id) { alert('No puede eliminar su usuario actual.'); return; }
      if (!confirm('¿Eliminar usuario?')) return;
      const res = await fetch(`/Gestion-stock-tienda-motos/app/borrar_usuario/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar usuario');
      await cargarUsuarios();
    } catch (e) {
      console.error(e);
      mostrarError(e.message || 'Error al eliminar usuario');
    }
  };

  // Advertencia contraseña
  const passInput = document.getElementById('usuario_contrasena');
  if (passInput) {
    passInput.addEventListener('input', () => {
      let adv = document.getElementById('pass-warning');
      if (!adv) {
        adv = document.createElement('div');
        adv.id = 'pass-warning';
        adv.className = 'alert alert-warning mt-2';
        passInput.parentNode.appendChild(adv);
      }
      if (passInput.value.length > 0) {
        adv.textContent = '¿Está seguro que desea cambiar la contraseña?';
        adv.style.display = '';
      } else {
        adv.style.display = 'none';
      }
    });
  }

  // Guardar/restaurar modal
  if (modalUsuarioEl) {
    modalUsuarioEl.addEventListener('show.bs.modal', () => {
      try {
        const isEditing = !!document.getElementById('usuario_id')?.value;
        if (!isEditing) restoreFormFromStorage();
        const adv = document.getElementById('pass-warning'); if (adv) adv.style.display = 'none';
        const alertDiv = modalUsuarioEl.querySelector('#user-alert'); if (alertDiv) alertDiv.remove();
      } catch (e) { console.error(e); }
    });

    modalUsuarioEl.addEventListener('hidden.bs.modal', () => {
      try {
        if (justSaved) {
          clearStorageAndForm();
          justSaved = false;
          return;
        }
        const isEditing = !!document.getElementById('usuario_id')?.value;
        if (!isEditing && formUsuario) {
          const hasData = Array.from(formUsuario.elements).some(el => {
            if (!el.id || el.id === 'usuario_contrasena') return false;
            if (el.type === 'checkbox') return !!el.checked;
            return (el.value && String(el.value).trim() !== '');
          });
          if (hasData) saveFormToStorage();
          else localStorage.removeItem(STORAGE_KEY);
        }
      } catch (e) { console.error(e); }
    });
  }

  // Botón Vaciar
  const footer = modalUsuarioEl?.querySelector('.modal-footer');
  if (footer && !document.getElementById('btnVaciarUsuario')) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'btnVaciarUsuario';
    btn.className = 'btn btn-danger';
    btn.textContent = 'Vaciar';
    btn.onclick = clearStorageAndForm;
    footer.appendChild(btn);
  }

  // Inicialización
  (async () => {
    const isAdmin = await verificarAdmin();
    if (isAdmin) await cargarUsuarios();
  })();

}); // DOMContentLoaded
