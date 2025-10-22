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

            // Inicializamos TomSelect solo si no existe (o reutilizamos si ya está)
            if (selectProducto.tomselect) {
                tomSelectProducto = selectProducto.tomselect;
                tomSelectProducto.clearOptions();
            } else if (!tomSelectProducto) {
                tomSelectProducto = new TomSelect(selectProducto, {
                    create: false,
                    sortField: { field: "nombre", direction: "asc" },
                    valueField: "value",
                    labelField: "nombre",
                    searchField: ["nombre", "codigo_barras"],
                    placeholder: "Seleccionar producto",
                    openOnFocus: true,
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

            // El dropdown abre al focus/click por configuración

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
            const consumidorFinal = data.find(c => c.id_cliente == 1);
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

            // Inicializamos o refrescamos TomSelect (reutilizar si ya está)
            if (selectCliente.tomselect) {
                tomSelectCliente = selectCliente.tomselect;
            }
            if (!tomSelectCliente) {
                tomSelectCliente = new TomSelect(selectCliente, {
                    create: false,
                    sortField: { field: "text", direction: "asc" },
                    openOnFocus: true
                });
            }
            tomSelectCliente.clearOptions();
            data.forEach(cliente => {
                tomSelectCliente.addOption({ value: cliente.id_cliente, text: `${cliente.nombre} ${cliente.apellido}` });
            });
            tomSelectCliente.refreshOptions();

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
            // Fallback: dejar Consumidor Final para poder operar sin lista remota
            selectCliente.innerHTML = '';
            const opcion = document.createElement('option');
            opcion.value = '0';
            opcion.textContent = 'Consumidor Final';
            selectCliente.appendChild(opcion);

            if (selectCliente.tomselect) {
                tomSelectCliente = selectCliente.tomselect;
            }
            if (!tomSelectCliente) {
                tomSelectCliente = new TomSelect(selectCliente, {
                    create: false,
                    openOnFocus: true
                });
            }
            tomSelectCliente.clearOptions();
            tomSelectCliente.addOption({ value: '0', text: 'Consumidor Final' });
            tomSelectCliente.refreshOptions();

            tomSelectCliente.clear(true);
            tomSelectCliente.addItem('0', true);
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

        let valorAnterior = prod.cantidad; // 👈 guardamos el valor anterior

        inputCant.addEventListener('input', e => {
            const val = e.target.value.trim();

            // Permitir que quede vacío mientras escribe
            if (val === '') return;

            const num = parseInt(val);
            if (!isNaN(num) && num >= 1) {
                productosVenta[idx].cantidad = num;
                valorAnterior = num; // actualizamos el valor anterior
                actualizarTotales();
            } else {
                e.target.value = valorAnterior; // 👈 volvemos al último válido
            }
        });

        inputCant.addEventListener('blur', e => {
            // Si deja vacío y sale del input, volver al valor anterior
            if (e.target.value.trim() === '') {
                e.target.value = valorAnterior;
            }
        });

        tdCantidad.appendChild(inputCant);
        fila.appendChild(tdCantidad);

        // Precio total por producto
        const tdPrecio = document.createElement('td');
        tdPrecio.textContent = (prod.precio * prod.cantidad).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
        inputTotalVenta.value = totalFinal.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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

    // Determinar los pagos
    // Determinar los pagos
    let pagosTexto = '';
    if (data.pagos && data.pagos.length > 0) {
        // Solo mostrar nombres de los métodos de pago
        pagosTexto = data.pagos
            .map(p => getNombreMetodoPago(String(p.id_medio_pago)))
            .join('<br>');
    } else {
        // Si solo hay un método seleccionado en el select
        pagosTexto = getNombreMetodoPago(selectMetodoPago.value);
    }



    // Generar el contenido del recibo
    reciboGuardado = `
    <html>
      <head>
        <title>Recibo de Venta</title>
        <style>
          body { font-family: 'Arial', sans-serif; margin: 20px; color: #333; }
          h2 { text-align: center; font-size: 24px; margin-bottom: 20px; color: #0d6efd; }
          .info p { margin: 4px 0; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 14px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background-color: #f8f9fa; }
          tr:nth-child(even) { background-color: #f2f2f2; }
          .totales { margin-top: 20px; font-weight: bold; font-size: 16px; }
          .totales p { margin: 4px 0; }
          .totales p span { float: right; }
          .gracias { text-align: center; margin-top: 30px; font-size: 16px; color: #198754; font-weight: bold; }
          @media print { body { margin: 0; padding: 10px; font-size: 12px; } h2 { font-size: 20px; } .totales { font-size: 14px; } }
        </style>
      </head>
      <body>
        <h2>Recibo de Venta</h2>
        <div class="info">
          <p><strong>Fecha:</strong> ${fechaActual}</p>
          <p><strong>Hora:</strong> ${horaActual}</p>
          <p><strong>Métodos de pago:</strong><br>${pagosTexto}</p>
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
            <p>Subtotal: <span>${formatearMoneda(productosVenta.reduce((acc, p) => acc + p.precio * p.cantidad, 0))}</span></p>
            <p>Descuento: <span>${inputDescuento.value || 0}%</span></p>
            <p>IVA: <span>${inputIVA.value || 0}%</span></p>
            <p>Total Final: <span>${inputTotalVenta.value}</span></p>
        </div>
        <div class="gracias">
          <p>¡Gracias por su compra!</p>
        </div>
      </body>
    </html>
  `;

    botonImprimirRecibo.disabled = false;
    botonImprimirRecibo.classList.remove('btn-secondary');
    botonImprimirRecibo.classList.add('btn-success');
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

    // Verificar si hay varios métodos seleccionados en el bloque visible
    const variosActivos = document.querySelectorAll('#bloque_varios_metodos .form-check-input:checked');
    const tieneVarios = variosActivos.length > 0;

    if (!tieneVarios && !selectMetodoPago.value) {
        alert('Debe seleccionar un método de pago.');
        return;
    }

    const idUsuario = localStorage.getItem('id_usuario');
    if (!idUsuario) {
        alert('No se encontró usuario logueado. Por favor inicia sesión de nuevo.');
        return;
    }

    const items = productosVenta.map(p => ({
        id_producto: p.id_producto,
        cantidad: p.cantidad,
        precio_unitario: p.precio,
        descuento: parseFloat(inputDescuento.value) || 0,
        iva: parseFloat(inputIVA.value) || 0
    }));

    let pagos = [];
    const totalVenta = parseFloat(inputTotalVenta.value.replace(/\./g, '').replace(',', '.')) || 0;

    if (tieneVarios) {
        variosActivos.forEach(chk => {
            let idMetodo = null;
            if (chk.id === 'varios_efectivo') idMetodo = 1;
            else if (chk.id === 'varios_transferencia') idMetodo = 2;
            else if (chk.id === 'varios_tarjeta') idMetodo = 4; // Tarjeta (crédito/débito genérico)

            const cont = chk.closest('.form-check');
            const montoInput = cont ? cont.querySelector('input.form-control') : null;
            const montoRaw = (montoInput?.value || '0').toString();

            // Parsear número (permite coma o punto)
            const monto = parseFloat(montoRaw.replace(/\./g, '').replace(',', '.')) || 0;

            if (idMetodo && monto > 0) {
                pagos.push({ id_medio_pago: idMetodo, monto });
            }
        });

        // Validar que la suma coincida con el total
        const sumaPagos = pagos.reduce((acc, p) => acc + p.monto, 0);
        const diferencia = Math.abs(sumaPagos - totalVenta);

        if (diferencia > 0.01) { // tolerancia mínima
            alert(`La suma de los métodos de pago (${sumaPagos.toFixed(2)}) no coincide con el total (${totalVenta.toFixed(2)}).`);
            return;
        }

    } else {
        const metodoPago = parseInt(selectMetodoPago.value);
        pagos.push({
            id_medio_pago: metodoPago,
            monto: totalVenta
        });
    }

    const data = {
        items,
        pagos,
        monto_total: totalVenta,
        tipo_comprobante: 'TICKET',
        nro_comprobante: Date.now().toString(),
        id_iva: 1,
        id_cliente: (selectCliente.value && selectCliente.value !== "0") ? Number(selectCliente.value) : null,
        id_usuario: Number(idUsuario)
    };

    botonFinalizar.disabled = true;
    botonFinalizar.textContent = 'Procesando...';

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

            // Limpiar y resetear
            productosVenta = [];
            actualizarTabla();
            actualizarTotales();
            selectMetodoPago.value = '';
            cambiarCamposMetodoPago();
            // Nota: Se elimina el auto-reload para mantener habilitado el botón de imprimir
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
 
// -------------------- INICIALIZACIÓN --------------------
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    cargarMetodosPago();
    cargarClientes();
    actualizarTotales();
});



// -------------------- BOTÓN VARIOS MÉTODOS DE PAGO --------------------
const btnVarios = document.getElementById('btn_varios_metodos');
const bloqueVarios = document.getElementById('bloque_varios_metodos');
btnVarios?.addEventListener('click', (e) => {
    e.preventDefault();
    const visible = bloqueVarios.style.display !== 'none';
    bloqueVarios.style.display = visible ? 'none' : 'block';
});

// Función para formato de moneda sin decimales
function formatoMoneda(valor) {
        if (valor == null || valor === '') return '';

        // Reemplazar comas por puntos y dejar solo dígitos y un punto
        valor = String(valor).replace(',', '.').replace(/[^\d.]/g, '');

        // Convertir a número
        const numero = parseFloat(valor);
        if (isNaN(numero)) return '';

        // Formatear con separador de miles y 2 decimales
        return '$' + numero.toLocaleString('es-AR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }