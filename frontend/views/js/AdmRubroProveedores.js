// Lógica separada de AdmRubroProveedores.php

const tbody = document.getElementById('tbodyRubros');
const btnNuevo = document.getElementById('btnNuevo');
const thAcciones = document.getElementById('thAcciones');
const modal = new bootstrap.Modal(document.getElementById('modalRubro'));
const form = document.getElementById('formRubro');
const idInput = document.getElementById('id_rubro');
const nombreInput = document.getElementById('nombre');
const tituloModal = document.getElementById('tituloModal');

let esAdmin = false;
let rubros = [];

function filaVacia(msg='Sin rubros') {
  return `<tr><td colspan="${esAdmin?3:2}" class="text-center text-secondary">${msg}</td></tr>`;
}

function render() {
  if (!rubros.length) {
    tbody.innerHTML = filaVacia();
    return;
  }
  tbody.innerHTML = rubros.map(r => {
    const acciones = esAdmin ? `
      <button class="btn btn-sm btn-warning me-1" onclick="editar(${r.id_rubro})">Editar</button>
      <button class="btn btn-sm btn-danger" onclick="eliminar(${r.id_rubro})">Borrar</button>
    ` : '';
    return `
      <tr>
        <td>${r.id_rubro}</td>
        <td>${r.nombre}</td>
        ${esAdmin ? `<td>${acciones}</td>` : ''}
      </tr>
    `;
  }).join('');
}

async function cargarRubros() {
  try {
    const res = await fetch(API_URL + 'rubros');
    if (!res.ok) throw new Error('Error al obtener rubros');
    rubros = await res.json();
    render();
  } catch (e) {
    tbody.innerHTML = filaVacia('Error cargando rubros');
    console.error(e);
  }
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  const id = idInput.value.trim();
  const payload = { nombre: nombreInput.value.trim() };
  if (!payload.nombre) return;

  const url = id ? (API_URL + 'actualizar_rubro/' + id) : (API_URL + 'crear_rubro');
  const method = id ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok || data.error) throw new Error(data.error || 'Error');
    modal.hide();
    await cargarRubros();
  } catch (err) {
    alert('Error: ' + err.message);
  }
});

window.editar = id => {
  const r = rubros.find(x => x.id_rubro == id);
  if (!r) return;
  idInput.value = r.id_rubro;
  nombreInput.value = r.nombre;
  tituloModal.textContent = 'Editar Rubro';
  modal.show();
};

window.eliminar = async id => {
  if (!confirm('¿Eliminar rubro?')) return;
  try {
    const res = await fetch(API_URL + 'borrar_rubro/' + id, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok || data.error) throw new Error(data.error || 'Error');
    await cargarRubros();
  } catch (e) {
    alert('Error: ' + e.message);
  }
};

btnNuevo.addEventListener('click', () => {
  idInput.value = '';
  form.reset();
  tituloModal.textContent = 'Nuevo Rubro';
  modal.show();
});

(function init() {
  fetch(API_URL + 'usuario-info')
    .then(r => r.json())
    .then(u => {
      esAdmin = u.rol === 'admin';
      if (esAdmin) {
        btnNuevo.classList.remove('d-none');
        thAcciones.style.display = '';
      }
      cargarRubros();
    })
    .catch(() => {
      tbody.innerHTML = filaVacia('No autenticado');
    });
})();