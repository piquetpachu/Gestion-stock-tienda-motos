
// Referencias a elementos DOM
const selectProducto = document.getElementById('seleccionar_producto');
const tablaProductosBody = document.querySelector('#tabla_productos tbody');

// const inputPrecioUnitario = document.getElementById('precio_unitario');
const inputDescuento = document.getElementById('descuento');
const inputIVA = document.getElementById('iva');
const inputTotalVenta = document.getElementById('total_venta');

const selectMetodoPago = document.getElementById('metodo_de_pago');
const divCamposAdicionalesPago = document.getElementById('campos_adicionales_pago');

const botonFinalizar = document.getElementById('boton_finalizar');
const botonCancelar = document.getElementById('boton_cancelar');
const mensajeResultado = document.getElementById('mensaje_resultado');

const botonImprimirRecibo = document.getElementById('btn_imprimir_recibo'); // Botón imprimir

// CLIENTES
const selectCliente = document.getElementById('seleccionar_cliente');
const btnAgregarCliente = document.getElementById('btn_agregar_cliente');
const modalCliente = new bootstrap.Modal(document.getElementById('modalCliente'));
const guardarClienteBtn = document.getElementById('guardar_cliente');
const formCliente = document.getElementById('form_cliente');

// Estado interno
let productosLista = [];
let productosVenta = [];
let metodosPagoLista = [];
let reciboGuardado = null;
let tomSelectCliente = null; // TomSelect para clientes
let tomSelectProducto = null; // TomSelect para productos

// Formateador de moneda
const formatearMoneda = valor =>
    valor.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

// -------------------- CARGA DE DATOS --------------------

// Cargar productos

// Cargar productos
function cargarProductos() {
    fetch(API_URL + 'productos')
        .then(res => {
            if (!res.ok) throw new Error('Error al obtener productos');
            return res.json();
        })
        .then(data => {
            productosLista = data;

            // Inicializamos TomSelect solo si no está creado
            if (!tomSelectProducto) {
                tomSelectProducto = new TomSelect(selectProducto, {
                    create: false,
                    sortField: { field: "nombre", direction: "asc" },
                    valueField: "codigo_barras",  // lo que usa internamente
                    labelField: "nombre",         // lo que se muestra
                    searchField: ["nombre", "codigo_barras"],  // permite búsqueda por ambos
                    placeholder: "Seleccionar producto"
                });
            } else {
                tomSelectProducto.clearOptions();
            }

            // Agregar opciones a TomSelect
            data.forEach(prod => {
                tomSelectProducto.addOption({
                    codigo_barras: prod.codigo_barras,
                    nombre: prod.nombre
                });
            });

            // Manejar selección de item
            tomSelectProducto.on('item_add', function (value) {
                agregarProducto(value);
            });

            // Manejar ENTER para agregar producto
            tomSelectProducto.on('keydown', function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const val = tomSelectProducto.getValue();
                    agregarProducto(val);
                }
            });
        })
        .catch(error => {
            console.error('Error cargando productos:', error);
            alert('No se pudieron cargar los productos. Revisa la consola.');
        });
}


// Cargar métodos de pago
function cargarMetodosPago() {
    fetch(API_URL + 'medios_pago')
        .then(res => {
            if (!res.ok) throw new Error('Error al obtener métodos de pago');
            return res.json();
        })
        .then(data => {
            metodosPagoLista = data;
            selectMetodoPago.innerHTML = '<option value="" disabled selected>Seleccionar método de pago</option>';
            data.forEach(metodo => {
                const opcion = document.createElement('option');
                opcion.value = metodo.id_medio_pago;
                opcion.textContent = metodo.descripcion || 'Sin nombre';
                selectMetodoPago.appendChild(opcion);
            });
        })
        .catch(error => {
            console.error('Error cargando métodos de pago:', error);
            alert('No se pudieron cargar los métodos de pago.');
        });
}

// Cargar clientes
function cargarClientes(seleccionarId = null) {
    fetch(API_URL + 'clientes')
        .then(res => {
            if (!res.ok) throw new Error('Error al obtener clientes');
            return res.json();
        })
        .then(data => {
            selectCliente.innerHTML = '<option value="" disabled selected>Seleccionar cliente</option>';
            data.forEach(cliente => {
                const opcion = document.createElement('option');
                opcion.value = cliente.id_cliente;
                opcion.textContent = `${cliente.nombre} ${cliente.apellido}`;
                selectCliente.appendChild(opcion);
            });

            if (!tomSelectCliente) {
                tomSelectCliente = new TomSelect(selectCliente, { create: false, sortField: { field: "text", direction: "asc" } });
            } else {
                tomSelectCliente.clearOptions();
                data.forEach(cliente => tomSelectCliente.addOption({ value: cliente.id_cliente, text: `${cliente.nombre} ${cliente.apellido}` }));
                tomSelectCliente.refreshOptions();
            }

            if (seleccionarId) {
                tomSelectCliente.addItem(seleccionarId);
            }
        })
        .catch(error => {
            console.error('Error cargando clientes:', error);
            alert('No se pudieron cargar los clientes. Revisa la consola.');
        });
}

// -------------------- CLIENTES --------------------

// Agregar cliente desde modal
btnAgregarCliente.addEventListener('click', () => modalCliente.show());

guardarClienteBtn.addEventListener('click', () => {
    if (!formCliente.checkValidity()) {
        formCliente.reportValidity();
        return;
    }

    const nuevoCliente = {
        nombre: document.getElementById('cliente_nombre').value.trim(),
        apellido: document.getElementById('cliente_apellido').value.trim(),
        cuil_cuit: document.getElementById('cliente_cuit').value.trim(),
        email: document.getElementById('cliente_email').value.trim(),
        telefono: document.getElementById('cliente_telefono').value.trim(),
        direccion: document.getElementById('cliente_direccion').value.trim()
    };

    guardarClienteBtn.disabled = true;
    guardarClienteBtn.textContent = 'Guardando...';

    fetch(API_URL + 'crear_cliente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoCliente)
    })
        .then(res => {
            if (!res.ok) throw new Error('Error al guardar el cliente');
            return res.json();
        })
        .then(clienteCreado => {
            modalCliente.hide();
            formCliente.reset();
            guardarClienteBtn.disabled = false;
            guardarClienteBtn.textContent = 'Guardar';
            cargarClientes(clienteCreado.id);
        })
        .catch(err => {
            alert('Error al guardar cliente: ' + err.message);
            guardarClienteBtn.disabled = false;
            guardarClienteBtn.textContent = 'Guardar';
        });
});

// 🚀 Limitador CUIT también en modal de cliente
document.addEventListener('DOMContentLoaded', () => {
    const inputCuitCliente = document.getElementById('cliente_cuit');
    if (inputCuitCliente) {
        inputCuitCliente.addEventListener('input', () => {
            let val = inputCuitCliente.value;
            val = val.replace(/[^0-9\-]/g, '');
            if (val.length > 2 && val[2] !== '-') val = val.slice(0, 2) + '-' + val.slice(2);
            if (val.length > 11 && val[11] !== '-') val = val.slice(0, 11) + '-' + val.slice(11);
            if (val.length > 13) val = val.slice(0, 13);
            inputCuitCliente.value = val;
        });
    }
});

// -------------------- PRODUCTOS Y VENTA --------------------

function buscarProductoPorCodigo(codigo) {
    return productosLista.find(p => p.codigo_barras === codigo);
}

function agregarProducto(codigoSeleccionado = null) {
    let codigo = codigoSeleccionado || tomSelectProducto.getValue();
    if (!codigo) return;

    const producto = buscarProductoPorCodigo(codigo);
    if (!producto) return;

    const indexExistente = productosVenta.findIndex(p => p.codigo === codigo);
    if (indexExistente >= 0) {
        productosVenta[indexExistente].cantidad += 1;
    } else {
        productosVenta.push({
            codigo: producto.codigo_barras,
            id_producto: producto.id_producto,
            nombre: producto.nombre,
            cantidad: 1,
            precio: parseFloat(producto.precio_venta) || 0
        });
    }

    actualizarTabla();
    actualizarTotales();

    if (tomSelectProducto) {
        tomSelectProducto.clear();
        tomSelectProducto.focus();
    }
}

// -------------------- TABLA Y TOTALES --------------------
// -------------------- TABLA Y TOTALES --------------------

function actualizarTabla() {
    tablaProductosBody.innerHTML = '';
    productosVenta.forEach((prod, idx) => {
        const fila = document.createElement('tr');

        // Código
        const tdCodigo = document.createElement('td');
        tdCodigo.textContent = prod.codigo;
        fila.appendChild(tdCodigo);

        // Nombre
        const tdNombre = document.createElement('td');
        tdNombre.textContent = prod.nombre;
        fila.appendChild(tdNombre);

        // Cantidad
        const tdCantidad = document.createElement('td');
        const inputCant = document.createElement('input');
        inputCant.type = 'number';
        inputCant.min = '1';
        inputCant.value = prod.cantidad;
        inputCant.className = 'form-control form-control-sm text-center';
        inputCant.addEventListener('input', e => {
            let val = parseInt(e.target.value);
            if (!isNaN(val) && val >= 1) {
                productosVenta[idx].cantidad = val;
                actualizarTotales();
            } else {
                e.target.value = productosVenta[idx].cantidad;
            }
        });
        tdCantidad.appendChild(inputCant);
        fila.appendChild(tdCantidad);

        // Precio total por producto
        const tdPrecio = document.createElement('td');
        tdPrecio.textContent = (prod.precio * prod.cantidad).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
        fila.appendChild(tdPrecio);

        // Acciones
        const tdAcciones = document.createElement('td');
        const btnEliminar = document.createElement('button');
        btnEliminar.className = 'btn btn-danger btn-sm';
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.addEventListener('click', () => {
            productosVenta.splice(idx, 1);
            actualizarTabla();
            actualizarTotales();
        });
        tdAcciones.appendChild(btnEliminar);
        fila.appendChild(tdAcciones);

        tablaProductosBody.appendChild(fila);
    });
}

function actualizarTotales() {
    // Calcular subtotal
    const subtotal = productosVenta.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

    // Leer descuento e IVA
    const descuentoPerc = parseFloat(inputDescuento.value) || 0;
    const ivaPerc = parseFloat(inputIVA.value) || 0;

    // Aplicar descuento
    const montoConDescuento = subtotal * (1 - descuentoPerc / 100);

    // Aplicar IVA
    const totalFinal = montoConDescuento * (1 + ivaPerc / 100);

    // Actualizar campo total en formato moneda
    if (inputTotalVenta) {
        inputTotalVenta.value = totalFinal.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
    }
}

// Listener para recalcular total al cambiar descuento
if (inputDescuento) {
    inputDescuento.addEventListener('input', actualizarTotales);
}


// -------------------- MÉTODO DE PAGO --------------------

function cambiarCamposMetodoPago() {
    const metodo = selectMetodoPago.value;
    divCamposAdicionalesPago.innerHTML = '';

    if (metodo === '2') { // tarjeta
        divCamposAdicionalesPago.innerHTML = `
          <div class="mb-3">
            <label for="cuit_tarjeta" class="form-label">CUIT/CUIL</label>
            <input type="text" class="form-control" id="cuit_tarjeta" placeholder="Ej: 20-12345678-9" pattern="^\\d{2}-\\d{8}-\\d{1}$" maxlength="13" required>
            <div class="form-text">Formato: 20-12345678-9</div>
          </div>
          <div class="mb-3">
            <label class="form-label">Fecha actual</label>
            <input type="text" class="form-control" value="${new Date().toLocaleDateString('es-AR')}" disabled>
          </div>
        `;

        const inputCuit = document.getElementById('cuit_tarjeta');
        inputCuit.addEventListener('input', () => {
            let val = inputCuit.value;
            val = val.replace(/[^0-9\-]/g, '');
            if (val.length > 2 && val[2] !== '-') val = val.slice(0, 2) + '-' + val.slice(2);
            if (val.length > 11 && val[11] !== '-') val = val.slice(0, 11) + '-' + val.slice(11);
            if (val.length > 13) val = val.slice(0, 13);
            inputCuit.value = val;
        });
    }
}

function getNombreMetodoPago(id) {
    const metodo = metodosPagoLista.find(m => m.id_medio_pago == id);
    return metodo ? metodo.descripcion : 'Desconocido';
}

// -------------------- RECIBO --------------------

function mostrarRecibo(data) {
    const fechaActual = new Date().toLocaleDateString('es-AR');
    const horaActual = new Date().toLocaleTimeString('es-AR', { hour12: false });

    reciboGuardado = `
    <html>
      <head>
        <title>Recibo de Venta</title>
        <style>
          body { font-family: monospace; padding: 20px; }
          h2 { text-align: center; }
          .info { margin-bottom: 15px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #000; padding: 6px; text-align: left; }
          .totales { margin-top: 20px; font-weight: bold; }
        </style>
      </head>
      <body>
        <h2>Recibo de Venta</h2>
        <div class="info">
          <p><strong>Fecha:</strong> ${fechaActual}</p>
          <p><strong>Hora:</strong> ${horaActual}</p>
          <p><strong>Método de pago:</strong> ${getNombreMetodoPago(selectMetodoPago.value)}</p>
          ${selectCliente.value ? `<p><strong>Cliente:</strong> ${selectCliente.options[selectCliente.selectedIndex].text}</p>` : ''}
        </div>
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
    `;

    productosVenta.forEach(p => {
        const totalProd = p.precio * p.cantidad;
        reciboGuardado += `
      <tr>
        <td>${p.nombre}</td>
        <td>${p.cantidad}</td>
        <td>${formatearMoneda(p.precio)}</td>
        <td>${formatearMoneda(totalProd)}</td>
      </tr>`;
    });

    reciboGuardado += `
          </tbody>
        </table>
        <div class="totales">
            <p>Subtotal: ${formatearMoneda(productosVenta.reduce((acc, p) => acc + p.precio * p.cantidad, 0))}</p>
            <p>Descuento: ${inputDescuento.value || 0}%</p>
            <p>IVA: ${inputIVA.value || 0}%</p>
            <p>Total Final: ${inputTotalVenta.value}</p>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <p>¡Gracias por su compra!</p>
        </div>
      </body>
    </html>
  `;
}

botonImprimirRecibo.addEventListener('click', () => {
    if (!reciboGuardado) {
        alert('No hay recibo para imprimir. Finalice una venta primero.');
        return;
    }
    const ventanaRecibo = window.open('', '_blank', 'width=600,height=800');
    ventanaRecibo.document.open();
    ventanaRecibo.document.write(reciboGuardado);
    ventanaRecibo.document.close();
    ventanaRecibo.focus();
    ventanaRecibo.print();
});

// -------------------- VENTA --------------------

function finalizarVenta() {
    if (productosVenta.length === 0) {
        alert('Debe agregar al menos un producto a la venta.');
        return;
    }

    if (!selectMetodoPago.value) {
        alert('Debe seleccionar un método de pago.');
        return;
    }
    const metodoPago = selectMetodoPago.value;
    const items = productosVenta.map(p => ({
        id_producto: p.id_producto,
        cantidad: p.cantidad,
        precio_unitario: p.precio,
        descuento: parseFloat(inputDescuento.value) || 0,
        iva: parseFloat(inputIVA.value) || 0
    }));

    const venta = {
        monto_total: parseFloat(inputTotalVenta.value.replace(/[^0-9.-]+/g, "")) || 0,
        tipo_comprobante: 'A', // o el que corresponda
        nro_comprobante: '0001-00000001', // generar dinámicamente si quieres
        id_usuario: 1, // reemplazar con tu usuario actual
        id_iva: parseFloat(inputIVA.value) || 0,
        items: items,
        pagos: [{
            id_medio_pago: selectMetodoPago.value,
            monto: parseFloat(inputTotalVenta.value.replace(/[^0-9.-]+/g, "")) || 0,
            cuil_cuit: selectMetodoPago.value === '2' ? document.getElementById('cuit_tarjeta')?.value || null : null
        }]
    };

    const montoTotal = parseFloat(inputTotalVenta.value.replace(/[^\d.-]/g, '')) || 0;

    const pago = {
        id_medio_pago: parseInt(metodoPago),
        monto: montoTotal
    };

    if (metodoPago === '2') {
        const cuitInput = document.getElementById('cuit_tarjeta');
        if (!cuitInput || !cuitInput.value) {
            alert('Debe ingresar un CUIT válido para tarjeta.');
            return;
        }
        pago.cuil_cuit = cuitInput.value;
    }

    venta.pagos = [pago];
    venta.id_cliente = selectCliente.value || null;

    botonFinalizar.disabled = true;
    botonFinalizar.textContent = 'Procesando...';
    const data = {
        items,
        pagos: [pago],
        monto_total: montoTotal,
        tipo_comprobante: 'TICKET', // Valor por defecto
        nro_comprobante: Date.now().toString(), // Generar número único
        id_iva: 1, // ID del IVA por defecto (ajusta según tu DB)
        id_usuario: 1 // ID del usuario logueado (ajusta según tu sesión)
    };
    fetch(API_URL + 'crear_venta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(res => {
            if (!res.ok) throw new Error('Error al procesar la venta');
            return res.json();
        })
        .then(res => {
            mensajeResultado.textContent = 'Venta registrada con éxito';
            mensajeResultado.classList.remove('text-danger');
            mensajeResultado.classList.add('text-success');

            productosVenta = [];
            actualizarTabla();
            actualizarTotales();
            selectMetodoPago.value = '';
            cambiarCamposMetodoPago();
            mostrarRecibo(res);
        })
        .catch(err => {
            mensajeResultado.textContent = 'Error al registrar la venta: ' + err.message;
            mensajeResultado.classList.remove('text-success');
            mensajeResultado.classList.add('text-danger');
            console.error(err);
        })
        .finally(() => {
            botonFinalizar.disabled = false;
            botonFinalizar.textContent = 'Finalizar Venta';
        });
}

botonFinalizar.addEventListener('click', finalizarVenta);
botonCancelar.addEventListener('click', () => {
    productosVenta = [];
    actualizarTabla();
    actualizarTotales();
    selectMetodoPago.value = '';
    cambiarCamposMetodoPago();
    mensajeResultado.textContent = '';
});

// Cambios en método de pago
selectMetodoPago.addEventListener('change', cambiarCamposMetodoPago);

// -------------------- INICIALIZACIÓN --------------------
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    cargarMetodosPago();
    cargarClientes();
    actualizarTotales();
});
