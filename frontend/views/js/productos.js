// productos.js - versión robusta con guardado en localStorage y soporte TomSelect
(function () {
  const STORAGE_KEY = "formProducto";

  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formProducto");
    const tabla = document.getElementById("tablaProductos");
    const paginacion = document.getElementById("paginacion");
    const busqueda = document.getElementById("busqueda");
    const ordenarPor = document.getElementById("ordenarPor");
    const modalProductoEl = document.getElementById("modalProducto");

    if (!form)
      console.warn("productos.js: no se encontró #formProducto en el DOM.");
    if (!modalProductoEl)
      console.warn("productos.js: no se encontró #modalProducto en el DOM.");

    let productos = [];
    let paginaActual = 1;
    const porPagina = 30;
    let usuarioRol = null;
    let productoModalPrevio = false;

      // Iconos SVG para acciones (coherentes con otros módulos)
      const SVG_EDIT = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="3" y1="13" x2="13" y2="3"></line>
          <polygon points="12,2 14,4 13,5 11,3" fill="currentColor" stroke="currentColor"></polygon>
          <rect x="2" y="12" width="3" height="2" fill="currentColor" stroke="none"></rect>
        </svg>`;
      const SVG_TRASH = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="4" y="5" width="8" height="9" rx="1"></rect>
          <line x1="6" y1="7" x2="6" y2="13"></line>
          <line x1="10" y1="7" x2="10" y2="13"></line>
          <polyline points="5,5 5,3 11,3 11,5"></polyline>
          <line x1="4" y1="5" x2="12" y2="5"></line>
        </svg>`;

    // Helpers localStorage
    function saveFormToStorage(formEl, key) {
      if (!formEl) return;
      const datos = {};
      Array.from(formEl.elements).forEach((el) => {
        if (!el.id) return;
        if (el.type === "checkbox") datos[el.id] = el.checked;
        else datos[el.id] = el.value;
      });
      try {
        localStorage.setItem(key, JSON.stringify(datos));
        console.log("productos.js: formulario guardado en localStorage");
      } catch (e) {
        console.error("productos.js: error guardando en localStorage", e);
      }
    }

    function restoreFormFromStorage(formEl, key) {
      if (!formEl) return false;
      const raw = localStorage.getItem(key);
      if (!raw) return false;
      try {
        const datos = JSON.parse(raw);
        Object.keys(datos).forEach((k) => {
          const el = document.getElementById(k);
          if (!el) return;
          if (el.type === "checkbox") el.checked = !!datos[k];
          else el.value = datos[k];
        });

        // Si hay TomSelect en proveedores/rubros, setearlos correctamente
        const selProv = document.getElementById("id_proveedor");
        if (selProv && selProv.tomselect) {
          const v = datos["id_proveedor"];
          if (!v) selProv.tomselect.clear();
          else {
            // si la opción no existe, la agregamos temporalmente (texto = valor)
            if (![...selProv.options].some((o) => o.value === String(v))) {
              selProv.tomselect.addOption({
                value: String(v),
                text: String(v),
              });
            }
            selProv.tomselect.setValue(String(v));
          }
        }
        const selRubro = document.getElementById("id_rubro");
        if (selRubro && selRubro.tomselect) {
          const v = datos["id_rubro"];
          if (!v) selRubro.tomselect.clear();
          else {
            if (![...selRubro.options].some((o) => o.value === String(v))) {
              selRubro.tomselect.addOption({
                value: String(v),
                text: String(v),
              });
            }
            selRubro.tomselect.setValue(String(v));
          }
        }

        console.log("productos.js: formulario restaurado desde localStorage");
        return true;
      } catch (e) {
        console.error("productos.js: error restaurando desde localStorage", e);
        return false;
      }
    }

    // Obtener rol y mostrar botón de agregar si corresponde
    fetch(API_URL + "usuario-info")
      .then((r) => r.json())
      .then((data) => {
        usuarioRol = data.rol;
        if (usuarioRol === "admin") {
          const btn = document.getElementById("btnAgregarProducto");
          if (btn) btn.style.display = "block";
          const colAcc = document.getElementById("colAcciones");
          if (colAcc) colAcc.style.display = "";
        } else {
          const colAcc = document.getElementById("colAcciones");
          if (colAcc) colAcc.style.display = "none";
        }
        mostrarProductos();
      })
      .catch((err) => console.warn("productos.js: error usuario-info", err));

    function cargarProductos() {
      fetch(API_URL + "productos")
        .then((res) => res.json())
        .then((data) => {
          productos = data || [];
          mostrarProductos();
        })
        .catch((err) =>
          console.error("productos.js: error cargando productos", err)
        );
    }
    

    function mostrarProductos() {
      if (!tabla) return;
      const filtro = (busqueda?.value || "").toLowerCase();
      const campoOrden = ordenarPor?.value || "";

      const filtrados = (productos || [])
        .filter((p) => {
          const searchTerm = filtro;
          return (
            (p.nombre && p.nombre.toLowerCase().includes(searchTerm)) ||
            (p.precio_venta &&
              p.precio_venta.toString().includes(searchTerm)) ||
            (p.precio_compra &&
              p.precio_compra.toString().includes(searchTerm)) ||
            (p.codigo_barras &&
              p.codigo_barras.toString().toLowerCase().includes(searchTerm)) ||
            (p.fecha_alta && p.fecha_alta.toLowerCase().includes(searchTerm))
          );
        })
        .sort((a, b) => {
          if (!campoOrden) return 0;
          let A = a[campoOrden] || "",
            B = b[campoOrden] || "";
          if (typeof A === "string") A = A.toLowerCase();
          if (typeof B === "string") B = B.toLowerCase();
          return A > B ? 1 : A < B ? -1 : 0;
        });

      const totalPaginas = Math.max(1, Math.ceil(filtrados.length / porPagina));
      const inicio = (paginaActual - 1) * porPagina;
      const productosPagina = filtrados.slice(inicio, inicio + porPagina);

      tabla.innerHTML = productosPagina
        .map((p) => {
          let botones = "";
          let tdAcciones = "";
          if (usuarioRol === "admin") {
            // add classes 'editar-btn' and 'borrar-btn' so the row click handler can ignore them
            botones = `
      <button class="btn btn-warning btn-sm editar-btn" title="Editar" aria-label="Editar" onclick='editar(${JSON.stringify(
        p
      )})'>${SVG_EDIT}</button>
      <button class="btn btn-danger btn-sm borrar-btn" title="Eliminar" aria-label="Eliminar" onclick='borrar(${
        p.id_producto
      })'>${SVG_TRASH}</button>
    `;
            tdAcciones = `<td class="acciones-col">${botones}</td>`;
          } else {
            tdAcciones = `<td style="display:none"></td>`;
          }

          // include data-id attribute so click handler can find the product id
          // aplicar clases según nivel de stock
          const stockVal = Number(p.stock || 0);
          const stockMin = Number(p.stock_minimo || 0);
          let clsStock = "";
          if (isNaN(stockVal)) clsStock = "";
          else if (stockVal <= 0) clsStock = "text-danger"; // rojo
          else if (stockVal <= stockMin) clsStock = "text-warning"; // amarillo

          return `
    <tr data-id="${p.id_producto}">
      <td>${p.nombre}</td>
      <td>${p.precio_venta || 0}</td>
      <td>${p.precio_compra || 0}</td>
      <td class="${clsStock}">${stockVal}</td>
      <td>${stockMin || 0}</td>
      <td>${p.codigo_barras || ""}</td>
      <td>${p.fecha_alta || ""}</td>
      ${tdAcciones}
    </tr>`;
        })
        .join("");

      if (paginacion) {
        paginacion.innerHTML = "";
        for (let i = 1; i <= totalPaginas; i++) {
          paginacion.innerHTML += `
            <li class="page-item ${i === paginaActual ? "active" : ""}">
              <button class="page-link" onclick="cambiarPagina(${i})">${i}</button>
            </li>`;
        }
      }
    }

    window.cambiarPagina = function (n) {
      paginaActual = n;
      mostrarProductos();
    };

    // Editar producto
    window.editar = function (p) {
      localStorage.removeItem(STORAGE_KEY); // limpiamos guardado porque vamos a editar
      const campos = [
        "id_producto",
        "nombre",
        "descripcion",
        "precio_venta",
        "precio_compra",
        "stock",
        "stock_minimo",
        "codigo_barras",
        "fecha_alta",
        "id_proveedor",
        "id_rubro",
        "activo",
      ];
      campos.forEach((campo) => {
        const el = document.getElementById(campo);
        if (el) el.value = p[campo] ?? "";
      });

      // si hay tomselect, setear value (si viene en p)
      const selProv = document.getElementById("id_proveedor");
      if (selProv && selProv.tomselect && p.id_proveedor) {
        if (
          ![...selProv.options].some((o) => o.value === String(p.id_proveedor))
        ) {
          selProv.tomselect.addOption({
            value: String(p.id_proveedor),
            text: String(p.id_proveedor),
          });
        }
        selProv.tomselect.setValue(String(p.id_proveedor));
      }
      const selRubro = document.getElementById("id_rubro");
      if (selRubro && selRubro.tomselect && p.id_rubro) {
        if (
          ![...selRubro.options].some((o) => o.value === String(p.id_rubro))
        ) {
          selRubro.tomselect.addOption({
            value: String(p.id_rubro),
            text: String(p.id_rubro),
          });
        }
        selRubro.tomselect.setValue(String(p.id_rubro));
      }

      new bootstrap.Modal(document.getElementById("modalProducto")).show();
    };

    // Borrar
    window.borrar = function (id) {
      if (!confirm("¿Eliminar producto?")) return;
      fetch(API_URL + "borrar_producto/" + id, { method: "DELETE" })
        .then((res) => res.json())
        .then(() => cargarProductos())
        .catch((err) =>
          console.error("productos.js: error borrando producto", err)
        );
    };

    // Nuevo producto
    window.nuevoProducto = function () {
      if (form) form.reset();
      if (document.getElementById("id_producto"))
        document.getElementById("id_producto").value = "";

      // restore values if exist
      const restored = restoreFormFromStorage(form, STORAGE_KEY);
      // Si TomSelect existe y no se restauró (por ejemplo no había datos),
      // dejamos los selects vacíos
      const selProv = document.getElementById("id_proveedor");
      if (selProv && selProv.tomselect && !restored) selProv.tomselect.clear();
      const selRubro = document.getElementById("id_rubro");
      if (selRubro && selRubro.tomselect && !restored)
        selRubro.tomselect.clear();

      new bootstrap.Modal(document.getElementById("modalProducto")).show();
    };

    // Guardar al cerrar modal (solo si es nuevo)
    if (modalProductoEl) {
      modalProductoEl.addEventListener("hide.bs.modal", () => {
        const idVal = document.getElementById("id_producto")?.value;
        if (!idVal && form) saveFormToStorage(form, STORAGE_KEY);
      });
    }

    // Botón Vaciar (solo una vez)
    (function ensureVaciarButton() {
      const footer = document.querySelector("#modalProducto .modal-footer");
      if (!footer) return;
      if (document.getElementById("btnVaciarProducto")) return;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.id = "btnVaciarProducto";
      btn.className = "btn btn-danger";
      btn.textContent = "Vaciar";
      btn.onclick = function () {
        if (form) form.reset();
        localStorage.removeItem(STORAGE_KEY);
        // limpiar TomSelect si existen
        const selProv = document.getElementById("id_proveedor");
        if (selProv && selProv.tomselect) selProv.tomselect.clear();
        const selRubro = document.getElementById("id_rubro");
        if (selRubro && selRubro.tomselect) selRubro.tomselect.clear();
      };
      footer.appendChild(btn);
    })();

    // Generar código de barras
    function generarCodigoBarras() {
      const base = Math.floor(Math.random() * 1e12)
        .toString()
        .padStart(12, "0");
      let suma = 0;
      for (let i = 0; i < 12; i++) {
        const num = parseInt(base[i]);
        suma += i % 2 === 0 ? num : num * 3;
      }
      const digitoControl = (10 - (suma % 10)) % 10;
      return base + digitoControl;
    }

    // Submit del form
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const datos = {
          id_producto: document.getElementById("id_producto")?.value || "",
          nombre: document.getElementById("nombre")?.value || "",
          descripcion: document.getElementById("descripcion")?.value || "",
          precio_venta:
            parseFloat(document.getElementById("precio_venta")?.value) || 0,
          precio_compra:
            parseFloat(document.getElementById("precio_compra")?.value) || 0,
          stock: parseInt(document.getElementById("stock")?.value) || 0,
          id_proveedor: document.getElementById("id_proveedor")?.value || null,
          id_rubro: document.getElementById("id_rubro")?.value || null,
          activo: document.getElementById("activo")?.checked ? 1 : 0,
          stock_minimo:
            parseInt(document.getElementById("stock_minimo")?.value) || 0,
          codigo_barras: (
            document.getElementById("codigo_barras")?.value || ""
          ).trim(),
        };

        if (!datos.codigo_barras) datos.codigo_barras = generarCodigoBarras();

        const id = datos.id_producto;
        const metodo = id ? "PUT" : "POST";
        const url = id
          ? API_URL + "actualizar_producto/" + id
          : API_URL + "crear_producto";

        localStorage.removeItem(STORAGE_KEY);

        fetch(url, {
          method: metodo,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos),
        })
          .then((res) => res.json())
          .then((resp) => {
            if (resp && resp.error) {
              alert("Error: " + resp.error);
            } else {
              bootstrap.Modal.getInstance(
                document.getElementById("modalProducto")
              )?.hide();
              form.reset();
              localStorage.removeItem(STORAGE_KEY); // limpiar storage
              // limpiar tomselect si corresponde
              const selProv = document.getElementById("id_proveedor");
              if (selProv && selProv.tomselect) selProv.tomselect.clear();
              const selRubro = document.getElementById("id_rubro");
              if (selRubro && selRubro.tomselect) selRubro.tomselect.clear();
              cargarProductos();
            }
          })
          .catch((err) => {
            console.error("productos.js: error guardando producto", err);
            alert("Ocurrió un error al guardar el producto.");
          });
      });
    }

    // Inicializar carga (proveedores/rubros son cargados por código existente)
    cargarProductos();
    // listeners para filtros
    if (busqueda)
      busqueda.addEventListener("input", () => {
        paginaActual = 1;
        mostrarProductos();
      });
    if (ordenarPor)
      ordenarPor.addEventListener("change", () => {
        paginaActual = 1;
        mostrarProductos();
      });

    // --- mantener funciones existentes para cargar rubros/proveedores, nuevos rubro/proveedor etc.
    // Si en tu versión original ya tienes las funciones cargarProveedores, cargarRubros,
    // manejo de form-nuevo-rubro y form-nuevo-proveedor, mantenelas como están.
    // (No las reescribo aquí porque tu archivo original ya las tenía; si querés,
    // puedo incorporarlas también con la misma estructura DOMContentLoaded.)
    // === Proveedores y Rubros ===
    async function cargarProveedores() {
      const select = document.getElementById("id_proveedor");
      select.innerHTML = '<option value="">Seleccione proveedor</option>';
      try {
        const res = await fetch(API_URL + "proveedores");
        const proveedores = await res.json();
        proveedores.forEach((p) => {
          const opt = document.createElement("option");
          opt.value = p.id_proveedor;
          opt.textContent = p.nombre;
          select.appendChild(opt);
        });
        if (!select.tomselect) {
          new TomSelect("#id_proveedor", {
            placeholder: "Seleccione proveedor",
          });
        } else {
          select.tomselect.clearOptions();
          proveedores.forEach((p) => {
            select.tomselect.addOption({
              value: String(p.id_proveedor),
              text: p.nombre,
            });
          });
        }
      } catch (err) {
        console.error("Error cargando proveedores", err);
      }
    }

    async function cargarRubros() {
      const select = document.getElementById("id_rubro");
      select.innerHTML = '<option value="">Seleccione rubro</option>';

      try {
        const res = await fetch(API_URL + "rubros");
        const rubros = await res.json();

        rubros.forEach((r) => {
          const opt = document.createElement("option");
          opt.value = r.id_rubro;
          opt.textContent = r.nombre;
          select.appendChild(opt);
        });

        if (!select.tomselect) {
          // Primera vez → crear TomSelect
          new TomSelect("#id_rubro", { placeholder: "Seleccione rubro" });
        } else {
          // Ya existe → limpiar y recargar opciones
          select.tomselect.clearOptions();
          rubros.forEach((r) => {
            select.tomselect.addOption({
              value: String(r.id_rubro),
              text: r.nombre,
            });
          });
          select.tomselect.refreshOptions(false); // 🔹 importante
        }
      } catch (err) {
        console.error("Error cargando rubros", err);
      }
    }

    // Botones + para abrir modales
    document.getElementById("btnNuevoRubro")?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const targetModalEl = document.getElementById("modalNuevoRubro");
      document.getElementById("form-nuevo-rubro")?.reset();
      const productoModal = bootstrap.Modal.getInstance(modalProductoEl);
      productoModalPrevio = modalProductoEl.classList.contains("show");
      const showTarget = () => bootstrap.Modal.getOrCreateInstance(targetModalEl).show();
      if (modalProductoEl.classList.contains("show") && productoModal) {
        const onHidden = () => {
          modalProductoEl.removeEventListener('hidden.bs.modal', onHidden);
          showTarget();
        };
        modalProductoEl.addEventListener('hidden.bs.modal', onHidden);
        productoModal.hide();
      } else {
        showTarget();
      }
      return false;
    });

    document.getElementById("btnNuevoProveedor")?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const targetModalEl = document.getElementById("modalNuevoProveedor");
      document.getElementById("form-nuevo-proveedor")?.reset();
      const productoModal = bootstrap.Modal.getInstance(modalProductoEl);
      productoModalPrevio = modalProductoEl.classList.contains("show");
      const showTarget = () => bootstrap.Modal.getOrCreateInstance(targetModalEl).show();
      if (modalProductoEl.classList.contains("show") && productoModal) {
        const onHidden = () => {
          modalProductoEl.removeEventListener('hidden.bs.modal', onHidden);
          showTarget();
        };
        modalProductoEl.addEventListener('hidden.bs.modal', onHidden);
        productoModal.hide();
      } else {
        showTarget();
      }
      return false;
    });

    // Submits de nuevos rubro/proveedor
    document
      .getElementById("form-nuevo-rubro")
      ?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const nombre = e.target.rubro_nombre.value;
        const res = await fetch(API_URL + "crear_rubro", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre }),
        });
        await res.json();
        await cargarRubros();
        bootstrap.Modal.getInstance(
          document.getElementById("modalNuevoRubro")
        )?.hide();
        if (productoModalPrevio) {
          bootstrap.Modal.getOrCreateInstance(modalProductoEl).show();
          productoModalPrevio = false;
        }
      });

    document
      .getElementById("form-nuevo-proveedor")
      ?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const nombre = e.target.proveedor_nombre.value;
        const res = await fetch(API_URL + "crear_proveedor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre }),
        });
        await res.json();
        await cargarProveedores();
        bootstrap.Modal.getInstance(
          document.getElementById("modalNuevoProveedor")
        )?.hide();
        if (productoModalPrevio) {
          bootstrap.Modal.getOrCreateInstance(modalProductoEl).show();
          productoModalPrevio = false;
        }
      });

    // Inicializar rubros/proveedores
    cargarProveedores();
    cargarRubros();

    // Añadir evento de clic a las filas de la tabla
// === Click en producto para ver detalles ===
document.getElementById('tablaProductos').addEventListener('click', async (e) => {
  const tr = e.target.closest('tr');
  if (!tr) return;
  // Ignorar cualquier clic dentro de la columna de acciones o en sus botones/iconos
  if (e.target.closest('td.acciones-col')) return;
  const btn = e.target.closest('button');
  if (btn && (btn.classList.contains('editar-btn') || btn.classList.contains('borrar-btn'))) return;

  const id = tr.dataset.id;
  mostrarDetalleProducto(id);
});

// === Mostrar detalle completo del producto ===
async function mostrarDetalleProducto(idProducto) {
  try {
    const res = await fetch(API_URL + 'producto/' + idProducto);
    const producto = await res.json();

    if (!producto) {
      alert("No se encontraron datos del producto.");
      return;
    }

    const detalleHTML = `
      <ul class="list-group list-group-flush">
        <li class="list-group-item"><b>ID:</b> ${producto.id_producto}</li>
        <li class="list-group-item"><b>Nombre:</b> ${producto.nombre}</li>
        <li class="list-group-item"><b>Descripción:</b> ${producto.descripcion || '-'}</li>
        <li class="list-group-item"><b>Precio Venta:</b> $${producto.precio_venta || 0}</li>
        <li class="list-group-item"><b>Precio Compra:</b> $${producto.precio_compra || 0}</li>
        <li class="list-group-item"><b>Stock:</b> ${producto.stock || 0}</li>
        <li class="list-group-item"><b>Stock Mínimo:</b> ${producto.stock_minimo || 0}</li>
        <li class="list-group-item"><b>Código de Barras:</b> ${producto.codigo_barras || '-'}</li>
        <li class="list-group-item"><b>Fecha de Alta:</b> ${producto.fecha_alta || '-'}</li>
        <li class="list-group-item"><b>Proveedor:</b> ${producto.nombre_proveedor || '-'}</li>
        <li class="list-group-item"><b>Rubro:</b> ${producto.nombre_rubro || '-'}</li>
        <li class="list-group-item"><b>Estado:</b> ${producto.activo == 1 ? 'Activo' : 'Inactivo'}</li>
      </ul>
    `;

    document.getElementById("detalleProducto").innerHTML = detalleHTML;
    document.getElementById("modalDetallesLabel").textContent = `Detalles de ${producto.nombre}`;
    new bootstrap.Modal(document.getElementById("modalDetalles")).show();
  } catch (err) {
    console.error("Error cargando detalle del producto:", err);
    alert("Hubo un error al obtener la información del producto.");
  }
}


// Función para mostrar las estadísticas del producto
async function mostrarEstadisticasProducto(idProducto) {
    const modalEstadisticasEl = document.getElementById('modalEstadisticas');
    if (!modalEstadisticasEl) {
        console.error("No se encontró el modal de estadísticas.");
        return;
    }
    const modalBody = modalEstadisticasEl.querySelector('.modal-body');
    const modalTitle = modalEstadisticasEl.querySelector('.modal-title');

    new bootstrap.Modal(modalEstadisticasEl).show();
    modalBody.innerHTML = `
        <div class="text-center">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
        </div>
    `;

    try {
        const res = await fetch(API_URL + 'estadisticas_producto/' + idProducto);
        const data = await res.json();

        const productoInfo = await obtenerProductoPorId(idProducto);
        modalTitle.textContent = `Estadísticas de: ${productoInfo.nombre || 'Producto Desconocido'}`;

        let htmlContenido = `
            <h5 class="mt-4">Resumen General</h5>
            <ul class="list-group">
                <li class="list-group-item">Total de Unidades Vendidas: <b>${data.totales.total_unidades || 0}</b></li>
                <li class="list-group-item">Total de Ventas (en dinero): <b>$${(parseFloat(data.totales.total_ventas) || 0).toFixed(2)}</b></li>
            </ul>
            <h5 class="mt-4">Detalle de Ventas</h5>
        `;

        if (data.ventas_detalles.length > 0) {
            htmlContenido += `
                <table class="table table-striped table-sm mt-3">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Cliente</th>
                            <th>Cantidad</th>
                            <th>Precio Unitario</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            data.ventas_detalles.forEach(venta => {
                const fechaCorta = venta.fecha.split(' ')[0];
                htmlContenido += `
                    <tr>
                        <td>${fechaCorta}</td>
                        <td>${venta.nombre_cliente} ${venta.apellido_cliente}</td>
                        <td>${venta.cantidad}</td>
                        <td>$${parseFloat(venta.precio_unitario).toFixed(2)}</td>
                    </tr>
                `;
            });
            htmlContenido += `
                        </tbody>
                    </table>
                `;
        } else {
            htmlContenido += `<p class="text-muted">No se encontraron ventas para este producto.</p>`;
        }

        modalBody.innerHTML = htmlContenido;
    } catch (error) {
        console.error("Error al obtener las estadísticas del producto:", error);
        modalBody.innerHTML = `<p class="text-danger">Hubo un error al cargar las estadísticas.</p>`;
    }
}

// Asegúrate de que esta función exista en tu archivo. Si no, agrégala.
async function obtenerProductoPorId(id) {
    try {
        const res = await fetch(API_URL + 'producto/' + id);
        return res.json();
    } catch (err) {
        console.error("Error al obtener producto por ID:", err);
        return {};
    }
}
  }); // DOMContentLoaded
  
})();
