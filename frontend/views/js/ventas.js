// Referencias a elementos DOM
const selectProducto = document.getElementById('seleccionar_producto');
const inputCodigoBarras = document.getElementById('codigo_de_barras');
const tablaProductosBody = document.querySelector('#tabla_productos tbody');

const inputPrecioUnitario = document.getElementById('precio_unitario');
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
function cargarProductos() {
    fetch(API_URL + 'productos')
        .then(res => {
            if (!res.ok) throw new Error('Error al obtener productos');
            return res.json();
        })
        .then(data => {
            productosLista = data;
            selectProducto.innerHTML = '<option value="" disabled selected>Seleccionar producto</option>';
            data.forEach(prod => {
                const opcion = document.createElement('option');
                opcion.value = prod.codigo_barras || '';
                opcion.textContent = prod.nombre || 'Sin nombre';
                selectProducto.appendChild(opcion);
            });

            if (!selectProducto.tomselect) {
                tomSelectProducto = new TomSelect(selectProducto, {
                    create: false,
                    sortField: { field: "text", direction: "asc" }
                });
                // Agregar producto automáticamente al seleccionar con click o Enter
                tomSelectProducto.on('item_add', function () {
                    agregarProducto();
                });
                tomSelectProducto.on('keydown', function (e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        agregarProducto();
                    }
                });
            } else {
                tomSelectProducto = selectProducto.tomselect;
            }
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

// Limitar CUIT a 11 números reales en modal de cliente
const inputCuitCliente = document.getElementById('cliente_cuit');
inputCuitCliente.addEventListener('input', () => {
    let val = inputCuitCliente.value.replace(/\D/g, ''); // solo números
    if (val.length > 11) val = val.slice(0, 11);
    inputCuitCliente.value = val;
});

guardarClienteBtn.addEventListener('click', () => {
    if (!formCliente.checkValidity()) {
        formCliente.reportValidity();
        return;
    }

    const nuevoCliente = {
        nombre: document.getElementById('cliente_nombre').value.trim(),
        apellido: document.getElementById('cliente_apellido').value.trim(),
        cuil_cuit: document.getElementById('cliente_cuit').value.trim(), // <-- CORRECCIÓN
        email: document.getElementById('cliente_email').value.trim(),
        telefono: document.getElementById('cliente_telefono').value.trim(),
        direccion: document.getElementById('cliente_direccion').value.trim()
    };

    if (nuevoCliente.cuil_cuit.length !== 11) { // <-- CORRECCIÓN
        alert('El CUIT/CUIL debe tener exactamente 11 números.');
        return;
    }

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

// -------------------- PRODUCTOS Y VENTA --------------------

// Buscar producto por código
function buscarProductoPorCodigo(codigo) {
    return productosLista.find(p => p.codigo_barras === codigo);
}

// Actualizar tabla de productos
function actualizarTabla() {
    tablaProductosBody.innerHTML = '';
    productosVenta.forEach((prod, idx) => {
        const fila = document.createElement('tr');

        const tdCodigo = document.createElement('td');
        tdCodigo.textContent = prod.codigo;
        fila.appendChild(tdCodigo);

        const tdNombre = document.createElement('td');
        tdNombre.textContent = prod.nombre;
        fila.appendChild(tdNombre);

        const tdCantidad = document.createElement('td');
        const inputCant = document.createElement('input');
        inputCant.type = 'number';
        inputCant.min = '1';
        inputCant.value = prod.cantidad;
        inputCant.className = 'form-control form-control-sm text-center';
        inputCant.addEventListener('change', e => {
            const val = parseInt(e.target.value);
            if (val >= 1) {
                productosVenta[idx].cantidad = val;
                actualizarTotales();
            } else {
                e.target.value = productosVenta[idx].cantidad;
            }
        });
        tdCantidad.appendChild(inputCant);
        fila.appendChild(tdCantidad);

        const tdPrecio = document.createElement('td');
        tdPrecio.textContent = formatearMoneda(prod.precio * prod.cantidad);
        fila.appendChild(tdPrecio);

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

// Calcular totales
function actualizarTotales() {
    const subtotal = productosVenta.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
    inputPrecioUnitario.value = formatearMoneda(subtotal);

    const descuentoPerc = parseFloat(inputDescuento.value) || 0;
    const ivaPerc = parseFloat(inputIVA.value) || 0;

    const montoConDescuento = subtotal * (1 - descuentoPerc / 100);
    const montoConIVA = montoConDescuento * (1 + ivaPerc / 100);
    inputTotalVenta.value = formatearMoneda(montoConIVA);
}

// Agregar producto a la venta
function agregarProducto() {
    const codigo = selectProducto.value || inputCodigoBarras.value;
    if (!codigo) return;

    const prod = buscarProductoPorCodigo(codigo);
    if (!prod) {
        alert('Producto no encontrado');
        return;
    }

    const existente = productosVenta.find(p => p.codigo === prod.codigo_barras);
    if (existente) {
        existente.cantidad += 1;
    } else {
        productosVenta.push({
            codigo: prod.codigo_barras,
            nombre: prod.nombre,
            precio: parseFloat(prod.precio),
            cantidad: 1
        });
    }

    actualizarTabla();
    actualizarTotales();

    selectProducto.value = '';
    if (tomSelectProducto) tomSelectProducto.clear();
    inputCodigoBarras.value = '';
}

// Finalizar venta
botonFinalizar.addEventListener('click', () => {
    if (productosVenta.length === 0) {
        alert('No hay productos en la venta');
        return;
    }
    if (!selectCliente.value) {
        alert('Debe seleccionar un cliente');
        return;
    }
    if (!selectMetodoPago.value) {
        alert('Debe seleccionar un método de pago');
        return;
    }

    const datosVenta = {
        cliente_id: selectCliente.value,
        metodo_pago_id: selectMetodoPago.value,
        productos: productosVenta.map(p => ({ codigo: p.codigo, cantidad: p.cantidad })),
        descuento: parseFloat(inputDescuento.value) || 0,
        iva: parseFloat(inputIVA.value) || 0,
        total: inputTotalVenta.value
    };

    fetch(API_URL + 'guardar_venta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosVenta)
    })
        .then(res => {
            if (!res.ok) throw new Error('Error al guardar la venta');
            return res.json();
        })
        .then(resp => {
            mensajeResultado.textContent = 'Venta registrada correctamente';
            reciboGuardado = resp.recibo;
            productosVenta = [];
            actualizarTabla();
            actualizarTotales();
        })
        .catch(err => {
            alert('Error al guardar la venta: ' + err.message);
        });
});

// Cancelar venta
botonCancelar.addEventListener('click', () => {
    if (confirm('¿Desea cancelar la venta actual?')) {
        productosVenta = [];
        actualizarTabla();
        actualizarTotales();
    }
});

// Cambiar método de pago
selectMetodoPago.addEventListener('change', () => {
    divCamposAdicionalesPago.innerHTML = '';
});

// Imprimir recibo
botonImprimirRecibo.addEventListener('click', () => {
    if (!reciboGuardado) {
        alert('No hay recibo para imprimir');
        return;
    }
    const ventana = window.open('', '_blank');
    ventana.document.write('<pre>' + JSON.stringify(reciboGuardado, null, 2) + '</pre>');
    ventana.print();
});

// Inicialización
cargarProductos();
cargarMetodosPago();
cargarClientes();
