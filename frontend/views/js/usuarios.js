// Protección: solo admin puede ver el panel
async function verificarAdmin() {
  try {
    const res = await fetch('/Gestion-stock-tienda-motos/app/usuario-info');
    if (!res.ok) throw new Error('No autenticado');
    const user = await res.json();
    if (user.rol !== 'admin') {
      document.getElementById('admin-alert').textContent = 'Acceso solo para administradores.';
      document.getElementById('admin-alert').classList.remove('d-none');
      document.querySelector('.container').style.display = 'none';
      return false;
    }
    return true;
  } catch {
    window.location.href = 'login.html';
    return false;
  }
}

// Listar usuarios en la tabla
async function cargarUsuarios() {
  const res = await fetch('/Gestion-stock-tienda-motos/app/usuarios');
  const usuarios = await res.json();
  const tbody = document.getElementById('tablaUsuarios');
  tbody.innerHTML = '';
  usuarios.forEach(u => {
    tbody.innerHTML += `
      <tr>
        <td>${u.id_usuario}</td>
        <td>${u.nombre}</td>
        <td>${u.email}</td>
        <td>${u.rol}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editarUsuario(${u.id_usuario})">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="eliminarUsuario(${u.id_usuario})">Eliminar</button>
        </td>
      </tr>
    `;
  });
}

// Registrar o actualizar usuario
const formUsuario = document.getElementById('formUsuario');
formUsuario.addEventListener('submit', async function(e) {
  e.preventDefault();
  // Confirmación antes de guardar
  if (!confirm('¿Está seguro que desea guardar estos datos?')) return;
  const datos = {
    nombre: document.getElementById('usuario_nombre').value,
    email: document.getElementById('usuario_email').value,
    rol: document.getElementById('usuario_rol').value,
    contrasena: document.getElementById('usuario_contrasena').value
  };
  const id = document.getElementById('usuario_id').value;
  let res;
  if (id) {
    // Actualizar
    res = await fetch(`/Gestion-stock-tienda-motos/app/actualizar_usuario/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
  } else {
    // Registrar
    res = await fetch('/Gestion-stock-tienda-motos/app/registrar_usuario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
  }
  if (res.ok) {
    cargarUsuarios();
    formUsuario.reset();
    document.getElementById('usuario_id').value = '';
    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalUsuario'));
    modal.hide();
  } else {
    alert('Error al guardar usuario');
  }
});

// Mostrar modal para registrar usuario
const btnAgregarUsuario = document.getElementById('btnAgregarUsuario');
btnAgregarUsuario.addEventListener('click', function() {
  formUsuario.reset();
  document.getElementById('usuario_id').value = '';
  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalUsuario'));
  modal.show();
});

// Editar usuario
window.editarUsuario = async function(id) {
  const res = await fetch(`/Gestion-stock-tienda-motos/app/usuario/${id}`);
  const usuario = await res.json();
  document.getElementById('usuario_id').value = usuario.id_usuario;
  document.getElementById('usuario_nombre').value = usuario.nombre;
  document.getElementById('usuario_email').value = usuario.email;
  document.getElementById('usuario_rol').value = usuario.rol;
  document.getElementById('usuario_contrasena').value = '';

  // Deshabilitar el select de rol si el usuario es el mismo que está logueado
  fetch('/Gestion-stock-tienda-motos/app/usuario-info')
    .then(res => res.ok ? res.json() : null)
    .then(user => {
      if (user && user.id === usuario.id_usuario) {
        document.getElementById('usuario_rol').disabled = true;
      } else {
        document.getElementById('usuario_rol').disabled = false;
      }
    });

  // Advertencia al cambiar contraseña
  const passInput = document.getElementById('usuario_contrasena');
  passInput.addEventListener('input', function() {
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
  // Ocultar advertencia al abrir modal
  let adv = document.getElementById('pass-warning');
  if (adv) adv.style.display = 'none';

  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalUsuario'));
  modal.show();
}

// Eliminar usuario
window.eliminarUsuario = async function(id) {
  // Verificar si es el usuario logueado
  const resUser = await fetch('/Gestion-stock-tienda-motos/app/usuario-info');
  const user = resUser.ok ? await resUser.json() : null;
  if (user && user.id === id) {
    alert('No puede eliminar su usuario actual.');
    return;
  }
  if (!confirm('¿Eliminar usuario?')) return;
  const res = await fetch(`/Gestion-stock-tienda-motos/app/borrar_usuario/${id}`, {
    method: 'DELETE'
  });
  if (res.ok) cargarUsuarios();
}

// Inicialización
verificarAdmin().then(isAdmin => {
  if (isAdmin) cargarUsuarios();
});
