<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Administrar Rubros</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="../css/style.css">
</head>
<body class="bg-dark text-light">
  <?php include 'navbar.php'; ?>
  <div class="container mt-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h3 m-0">📂 Rubros</h1>
      <button id="btnNuevo" class="btn btn-success d-none">➕ Nuevo Rubro</button>
    </div>

    <!-- Formulario (modal) -->
    <div class="modal fade" id="modalRubro" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <form id="formRubro" class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="tituloModal">Nuevo Rubro</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <input type="hidden" id="id_rubro">
            <div class="mb-3">
              <label class="form-label">Nombre</label>
              <input type="text" id="nombre" class="form-control" required>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" type="submit" id="btnGuardar">Guardar</button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Tabla -->
    <div class="table-responsive">
      <table class="table table-striped table-bordered align-middle table-dark">
        <thead>
          <tr>
            <th style="width:80px">ID</th>
            <th>Nombre</th>
            <th id="thAcciones" style="width:160px; display:none;">Acciones</th>
          </tr>
        </thead>
        <tbody id="tbodyRubros">
          <tr><td colspan="3" class="text-center">Cargando...</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <script src="../js/config.js"></script>
  <script src="../js/dashboard-proteccion.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script>
  // Reutilizamos el patrón usado en otras vistas (productos/clientes)
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

  // Crear / actualizar
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

  // Expuestas para botones
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

  // Obtener rol
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
  </script>
</body>
</html>