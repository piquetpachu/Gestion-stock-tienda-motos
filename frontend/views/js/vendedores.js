// vendedores.js - CRUD de usuarios con rol 'vendedor'

document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.getElementById('tbodyVendedores');
  const btnNuevo = document.getElementById('btnAgregarVendedor');
  const form = document.getElementById('formVendedor');
  const modalEl = document.getElementById('modalVendedor');
  const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
  const info = document.getElementById('vend_info');

  async function cargar() {
    try {
      const res = await fetch(API_URL + 'usuarios', { credentials: 'same-origin' });
      if (!res.ok) throw new Error('Error al cargar');
      const usuarios = await res.json();
      const vendedores = usuarios.filter((u) => u.rol === 'vendedor');
      if (!vendedores.length) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center text-secondary">Sin vendedores</td></tr>';
        return;
      }
      tbody.innerHTML = vendedores
        .map(
          (v) => `
        <tr>
          <td>${v.nombre}</td>
          <td>${v.email}</td>
          <td>
            <button class="btn btn-sm btn-warning me-1" data-id="${v.id_usuario}" data-action="edit">Editar</button>
            <button class="btn btn-sm btn-danger" data-id="${v.id_usuario}" data-action="del">Eliminar</button>
          </td>
        </tr>
      `
        )
        .join('');
    } catch (e) {
      console.error(e);
      tbody.innerHTML = '<tr><td colspan="3" class="text-center text-danger">Error</td></tr>';
    }
  }

  tbody.addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const id = btn.getAttribute('data-id');
    const action = btn.getAttribute('data-action');
    if (action === 'edit') {
      try {
        const res = await fetch(API_URL + 'usuario/' + id, { credentials: 'same-origin' });
        if (!res.ok) throw new Error('No se encontró');
        const u = await res.json();
        document.getElementById('vend_id').value = u.id_usuario || '';
        document.getElementById('vend_nombre').value = u.nombre || '';
        document.getElementById('vend_email').value = u.email || '';
        document.getElementById('vend_contrasena').value = '';
        if (info) {
          info.style.display = 'block';
          info.textContent = 'Rol fijo: vendedor';
        }
        modal.show();
      } catch (err) {
        alert('Error: ' + err.message);
      }
    }
    if (action === 'del') {
      if (!confirm('¿Eliminar vendedor?')) return;
      try {
        const res = await fetch(API_URL + 'borrar_usuario/' + id, {
          method: 'DELETE',
          credentials: 'same-origin',
        });
        if (!res.ok) throw new Error('No se pudo eliminar');
        await cargar();
      } catch (err) {
        alert('Error: ' + err.message);
      }
    }
  });

  if (btnNuevo) {
    btnNuevo.addEventListener('click', () => {
      document.getElementById('vend_id').value = '';
      form.reset();
      if (info) {
        info.style.display = 'block';
        info.textContent = 'Rol fijo: vendedor';
      }
      modal.show();
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('vend_id').value.trim();
      const payload = {
        nombre: document.getElementById('vend_nombre').value.trim(),
        email: document.getElementById('vend_email').value.trim(),
        rol: 'vendedor',
      };
      const pass = document.getElementById('vend_contrasena').value;
      if (pass) payload.contrasena = pass;
      try {
        const url = id
          ? API_URL + 'actualizar_usuario/' + id
          : API_URL + 'registrar_usuario';
        const method = id ? 'PUT' : 'POST';
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          let text = 'Error al guardar';
          try {
            const j = await res.json();
            if (j.error) text = j.error;
          } catch {}
          throw new Error(text);
        }
        modal.hide();
        await cargar();
      } catch (err) {
        alert('Error: ' + err.message);
      }
    });
  }

  // Init
  (async () => {
    try {
      const res = await fetch(API_URL + 'usuario-info', { credentials: 'same-origin' });
      if (!res.ok) throw new Error('No autenticado');
      const u = await res.json();
      if (u.rol !== 'admin') {
        const panel = document.getElementById('vendedores-panel');
        if (panel) panel.style.display = 'none';
        const alert = document.getElementById('vendedores-alert');
        if (alert) {
          alert.textContent = 'Acceso solo para administradores.';
          alert.classList.remove('d-none');
        }
        document.body.style.display = '';
        return;
      }
      document.body.style.display = '';
      await cargar();
    } catch {
      window.location.href = '../html/login.html';
    }
  })();
});
