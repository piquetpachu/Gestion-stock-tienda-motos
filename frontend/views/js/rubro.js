const API = '/Gestion-stock-tienda-motos/app/rubros';

async function cargarRubros() {
  const res = await fetch(API);
  const rubros = await res.json();
  const cont = document.getElementById('rubro-list');
  cont.innerHTML = '';
  rubros.forEach(rubro => {
    const detalles = document.createElement('details');
    detalles.className = 'rubro';
    detalles.innerHTML = `
      <summary>
        <div class="rubro-summary">
          <div class="rubro-title">
            <input type="checkbox" name="rubro_delete[]" value="${rubro.id}" />
            <h3>${rubro.nombre}</h3>
          </div>
          <p class="rubro-desc">${rubro.descripcion}</p>
        </div>
      </summary>
      <div class="productos">
        <h4>Productos</h4>
        <fieldset class="productos-list">
          ${rubro.productos.map(prod => `
            <label class="producto-item">
              <input type="checkbox" name="producto_delete[]" value="${rubro.id}-${prod.id}" />
              <span>${prod.nombre}</span>
            </label>
          `).join('')}
        </fieldset>
        <div class="form-actions compact">
          <button type="button" class="btn danger" onclick="quitarProductos(${rubro.id}, this)">Quitar seleccionados</button>
        </div>
        <form class="subform" onsubmit="agregarProducto(event, ${rubro.id})">
          <input type="hidden" name="rubro_id" value="${rubro.id}" />
          <div class="form-grid">
            <div class="form-field full">
              <label>Nombre del producto</label>
              <input name="producto_nombre" type="text" required />
            </div>
            <div class="form-field full">
              <label>Descripción</label>
              <textarea name="producto_descripcion" rows="2" required></textarea>
            </div>
            <div class="form-actions compact">
              <button type="submit" class="btn primary">Añadir producto</button>
            </div>
          </div>
        </form>
      </div>
    `;
    cont.appendChild(detalles);
  });
}

document.getElementById('form-nuevo-rubro').addEventListener('submit', async e => {
  e.preventDefault();
  const nombre = e.target.rubro_nombre.value;
  const descripcion = e.target.rubro_descripcion.value;
  await fetch(API.replace('rubros', 'crear_rubro'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, descripcion })
  });
  e.target.reset();
  cargarRubros();
});

document.getElementById('form-quitar-rubros').addEventListener('submit', async e => {
  e.preventDefault();
  const checks = [...e.target.querySelectorAll('input[name="rubro_delete[]"]:checked')];
  for (const chk of checks) {
    await fetch(`${API.replace('rubros', 'borrar_rubro')}/${chk.value}`, { method: 'DELETE' });
  }
  cargarRubros();
});

window.agregarProducto = async (ev, rubroId) => {
  ev.preventDefault();
  const fd = new FormData(ev.target);
  await fetch(`/Gestion-stock-tienda-motos/app/crear_producto`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre: fd.get('producto_nombre'),
      descripcion: fd.get('producto_descripcion'),
      rubro_id: rubroId
    })
  });
  cargarRubros();
};

window.quitarProductos = async (rubroId, btn) => {
  const productos = [...btn.closest('.productos').querySelectorAll('input[name="producto_delete[]"]:checked')];
  for (const prod of productos) {
    const prodId = prod.value.split('-')[1];
    await fetch(`/Gestion-stock-tienda-motos/app/borrar_producto/${prodId}`, { method: 'DELETE' });
  }
  cargarRubros();
};

cargarRubros();