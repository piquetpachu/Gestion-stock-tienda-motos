
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

function buscarProductoPorCodigo(codigo) {
    return productosLista.find(p => p.codigo_barras === codigo);
}

// Cargar productos
function cargarProductos() {
    fetch(API_URL + 'productos')
        .then(res => {
            if (!res.ok) throw new Error('Error al obtener productos');
            return res.json();
        })
        .then(data => {
            productosLista = data;

            // Inicializamos TomSelect solo si no existe
            if (!tomSelectProducto) {
                tomSelectProducto = new TomSelect(selectProducto, {
                    create: false,
                    sortField: { field: "nombre", direction: "asc" },
                    valueField: "value",
                    labelField: "nombre",
                    searchField: ["nombre", "codigo_barras"],
                    placeholder: "Seleccionar producto",
                    openOnFocus: false, // NO abrir solo por focus (evita desplegar al cargar)
                    onItemAdd: function (value) {
                        agregarProducto(value);
                        this.clear();
                        setTimeout(() => this.close(), 50);
                    }
                });
            } else {
                tomSelectProducto.clearOptions();
            }

            // Agregar todas las opciones
            data.forEach(prod => {
                tomSelectProducto.addOption({
                    value: prod.codigo_barras,
                    nombre: prod.nombre
                });
            });

            // Refrescar opciones y cerrar dropdown
            tomSelectProducto.refreshOptions();
            tomSelectProducto.close();

            // --- AÑADIMOS: permitir abrir con CLICK ---
            // TomSelect expone el input real en control_input
            setTimeout(() => {
                const inputTom = tomSelectProducto.control_input;
                if (inputTom) {
                    // Al hacer click en el input, abrimos el dropdown manualmente
                    inputTom.addEventListener('click', (e) => {
                        e.stopPropagation();
                        tomSelectProducto.open();
                    });

                    // También abrir al hacer mousedown (mejor sensación de clic)
                    inputTom.addEventListener('mousedown', (e) => {
                        e.stopPropagation();
                        tomSelectProducto.open();
                    });
                }
            }, 50);

            // ENTER desde input (scanner o nombre completo)
            const inputTomEnter = tomSelectProducto.control_input;
            if (inputTomEnter) {
                inputTomEnter.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        const texto = inputTomEnter.value.trim();
                        if (!texto) return;

                        const producto = productosLista.find(p =>
                            p.nombre.toLowerCase() === texto.toLowerCase() ||
                            p.codigo_barras === texto
                        );

                        if (producto) {
                            agregarProducto(producto.codigo_barras);
                        }

                        tomSelectProducto.clear();
                        tomSelectProducto.focus();
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error cargando productos:', error);
            alert('No se pudieron cargar los productos. Revisa la consola.');
        });
}


// Cargar métodos de pago
function cargarMetodosPago() {
    // Conservar fetch para que la app siga conectada a la BD
    fetch(API_URL + 'medios_pago')
        .then(res => res.json())
        .then(data => {
            metodosPagoLista = data; // guardamos la info por si se necesita

            // Sobrescribimos el select con las opciones que queremos mostrar
            selectMetodoPago.innerHTML = `
                <option value="" disabled selected>Seleccionar método</option>
                <option value="1">Efectivo</option>
                <option value="2">Transferencia Bancaria</option>
                <option value="3">Mercado Pago</option>
                <option value="4">Tarjeta</option>
                <option value="6">Cuenta Corriente</option>
            `;
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
            // Limpiamos select
            selectCliente.innerHTML = '';

            // Tomamos el primer cliente que sea "Consumidor Final" de la BD
            const consumidorFinal = data.find(c => c.id_cliente == 9);
            if (consumidorFinal) {
                const opcion = document.createElement('option');
                opcion.value = consumidorFinal.id_cliente;
                opcion.textContent = `${consumidorFinal.nombre} ${consumidorFinal.apellido}`;
                selectCliente.appendChild(opcion);
            }

            // Agregamos el resto de clientes
            data.forEach(cliente => {
                if (cliente.id_cliente != 0) {
                    const opcion = document.createElement('option');
                    opcion.value = cliente.id_cliente;
                    opcion.textContent = `${cliente.nombre} ${cliente.apellido}`;
                    selectCliente.appendChild(opcion);
                }
            });

            // Inicializamos o refrescamos TomSelect
            if (!tomSelectCliente) {
                tomSelectCliente = new TomSelect(selectCliente, {
                    create: false,
                    sortField: { field: "text", direction: "asc" }
                });
            } else {
                tomSelectCliente.clearOptions();
                data.forEach(cliente => {
                    tomSelectCliente.addOption({ value: cliente.id_cliente, text: `${cliente.nombre} ${cliente.apellido}` });
                });
                tomSelectCliente.refreshOptions();
            }

            // Seleccionamos por defecto
            if (seleccionarId) {
                tomSelectCliente.addItem(seleccionarId, true);
            } else if (consumidorFinal) {
                tomSelectCliente.addItem(consumidorFinal.id_cliente, true);
            } else if (data.length > 0) {
                tomSelectCliente.addItem(data[0].id_cliente, true); // Primer cliente de la lista si no hay Consumidor Final
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
        tomSelectProducto.clear();          // Limpiar el input
        setTimeout(() => tomSelectProducto.close(), 50);  // Esperar 50ms y cerrar el dropdown
        tomSelectProducto.focus();          // Volver a enfocar para seguir agregando productos
    }

}

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

// -------------------- MÉTODO DE PAGO --------------------
// -------------------- MÉTODO DE PAGO --------------------
// -------------------- MÉTODO DE PAGO --------------------
function cambiarCamposMetodoPago() {
    const metodo = selectMetodoPago.value;
    divCamposAdicionalesPago.innerHTML = '';

    if (metodo === '1' || metodo === '2' || metodo === '3' || metodo === '6') {
        // Efectivo, Transferencia bancaria, Mercado Pago, Cuenta corriente → nada extra
        divCamposAdicionalesPago.innerHTML = '';
    }

    if (metodo === '4' || metodo === '5') {
        // Tarjeta → mostrar tipo (crédito/débito)

        divCamposAdicionalesPago.innerHTML = `
          <div class="mb-3">
            <label class="form-label">Tipo de tarjeta</label>
            <select class="form-select" id="tipo_tarjeta" required>
                <option value="" disabled selected>Seleccione</option>
                <option value="credito">Crédito</option>
                <option value="debito">Débito</option>
            </select>
          </div>
          <div class="mb-3" id="bloque_cuotas" style="display:none;">
            <label class="form-label">Cuotas</label>
            <select class="form-select" id="cuotas">
                <option value="1">1 cuota</option>
                <option value="3">3 cuotas</option>
                <option value="6">6 cuotas</option>
                <option value="12">12 cuotas</option>
            </select>
          </div>
        `;

        const selectTipoTarjeta = document.getElementById('tipo_tarjeta');
        const bloqueCuotas = document.getElementById('bloque_cuotas');

        selectTipoTarjeta.addEventListener('change', () => {
            if (selectTipoTarjeta.value === 'credito') {
                bloqueCuotas.style.display = 'block';
                selectMetodoPago.value = '4'; // Tarjeta crédito ID BD
            } else if (selectTipoTarjeta.value === 'debito') {
                bloqueCuotas.style.display = 'none';
                selectMetodoPago.value = '5'; // Tarjeta débito ID BD
            }
        });
    }
}

// Escucha cambios en el select de método de pago
selectMetodoPago.addEventListener('change', cambiarCamposMetodoPago);

// -------------------- RECIBO --------------------
function getNombreMetodoPago(id) {
    switch (id) {
        case '1': return 'Efectivo';
        case '2': return 'Transferencia Bancaria';
        case '3': return 'Mercado Pago';
        case '4': return 'Tarjeta Crédito';
        case '5': return 'Tarjeta Débito';
        case '6': return 'Cuenta Corriente';
        default: return 'Desconocido';
    }
}



function mostrarRecibo(data) {
    const fechaActual = new Date().toLocaleDateString('es-AR');
    const horaActual = new Date().toLocaleTimeString('es-AR', { hour12: false });

    // Generar el contenido del recibo
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

    // ✅ Habilitar el botón de imprimir solo después de generar el recibo
    botonImprimirRecibo.disabled = false;
    // Cambiar la clase de color de gris a verde
    botonImprimirRecibo.classList.remove('btn-secondary');
    botonImprimirRecibo.classList.add('btn-success');

    // 🔹 Forzar colores para evitar que el estilo de "disabled" lo deje gris
    botonImprimirRecibo.style.backgroundColor = '#198754';
    botonImprimirRecibo.style.borderColor = '#198754';
    botonImprimirRecibo.style.color = '#fff';
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

    const idUsuario = localStorage.getItem('id_usuario');
    if (!idUsuario) {
        alert('No se encontró usuario logueado. Por favor inicia sesión de nuevo.');
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
        id_usuario: Number(idUsuario), // ahora toma el valor correcto
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

    // if (metodoPago === '2') {
    //     // const cuitInput = document.getElementById('cuit_tarjeta');
    //     if (!cuitInput || !cuitInput.value) {
    //         alert('Debe ingresar un CUIT válido para tarjeta.');
    //         return;
    //     }
    //     pago.cuil_cuit = cuitInput.value;
    // }

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
        id_cliente: (selectCliente.value && selectCliente.value !== "0") ? Number(selectCliente.value) : null,
        id_usuario: Number(idUsuario) // ahora toma el valor correcto
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


            mostrarRecibo(data);


            productosVenta = [];
            actualizarTabla();
            actualizarTotales();
            selectMetodoPago.value = '';
            cambiarCamposMetodoPago();
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


// -------------------- BOTÓN VARIOS MÉTODOS --------------------
const bloqueVariosMetodos = document.getElementById('bloque_varios_metodos');
const btnVariosMetodos = document.getElementById('btn_varios_metodos');

// Ocultar bloque al inicio
bloqueVariosMetodos.style.display = 'none';

// Listener del botón
btnVariosMetodos.addEventListener('click', () => {
    bloqueVariosMetodos.style.display =
        (bloqueVariosMetodos.style.display === 'none' || bloqueVariosMetodos.style.display === '')
            ? 'block'
            : 'none';
});

