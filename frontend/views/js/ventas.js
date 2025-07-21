// Referencias a elementos DOM
const selectProducto = document.getElementById('seleccionar_producto');
const inputCodigoBarras = document.getElementById('codigo_de_barras');
const botonAgregar = document.getElementById('boton_agregar_producto');
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

// Estado interno
let productosLista = [];
let productosVenta = [];
let metodosPagoLista = [];

// Formateador de moneda
const formatearMoneda = valor =>
    valor.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

// Cargar productos
function cargarProductos() {
    fetch('http://localhost/Gestion-stock-tienda-motos/app/productos')
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
        })
        .catch(error => {
            console.error('Error cargando productos:', error);
            alert('No se pudieron cargar los productos. Revisa la consola.');
        });
}

// Cargar métodos de pago
function cargarMetodosPago() {
    fetch('http://localhost/Gestion-stock-tienda-motos/app/medios_pago')
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

function buscarProductoPorCodigo(codigo) {
    return productosLista.find(p => p.codigo_barras === codigo);
}

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

function actualizarTotales() {
    const subtotal = productosVenta.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
    inputPrecioUnitario.value = formatearMoneda(subtotal);

    const descuentoPerc = parseFloat(inputDescuento.value) || 0;
    const ivaPerc = parseFloat(inputIVA.value) || 0;

    const montoConDescuento = subtotal * (1 - descuentoPerc / 100);
    const total = montoConDescuento * (1 + ivaPerc / 100);

    inputTotalVenta.value = formatearMoneda(total);
}

inputDescuento.addEventListener('input', actualizarTotales);
inputIVA.addEventListener('input', actualizarTotales);

function agregarProducto() {
    let codigoSeleccionado = selectProducto.value;
    let codigoEscaneado = inputCodigoBarras.value.trim();
    let codigo = codigoSeleccionado || codigoEscaneado;

    if (!codigo) {
        alert('Debe seleccionar un producto o ingresar un código de barras.');
        return;
    }

    const producto = buscarProductoPorCodigo(codigo);
    if (!producto) {
        alert('Producto no encontrado.');
        return;
    }

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

    selectProducto.value = '';
    inputCodigoBarras.value = '';
}

function cambiarCamposMetodoPago() {
    const metodo = selectMetodoPago.value;
    divCamposAdicionalesPago.innerHTML = '';

    if (metodo === '2') { // tarjeta
        divCamposAdicionalesPago.innerHTML = `
          <div class="mb-3">
            <label for="cuit_tarjeta" class="form-label">CUIT/CUIL</label>
            <input
              type="text"
              class="form-control"
              id="cuit_tarjeta"
              placeholder="Ej: 20-12345678-9"
              pattern="^\\d{2}-\\d{8}-\\d{1}$"
              maxlength="13"
              title="Formato válido: XX-XXXXXXXX-X (sólo números y guiones)"
              autocomplete="off"
              required
            >
            <div class="form-text">Formato: 20-12345678-9</div>
          </div>
          <div class="mb-3">
            <label class="form-label">Fecha actual (se asigna automáticamente)</label>
            <input type="text" class="form-control" value="${new Date().toLocaleDateString('es-AR')}" disabled>
          </div>
        `;

        // Validación y formateo en tiempo real del CUIT/CUIL
        const inputCuit = document.getElementById('cuit_tarjeta');
        inputCuit.addEventListener('input', () => {
            let val = inputCuit.value;
            // Permitir sólo números y guiones
            val = val.replace(/[^0-9\-]/g, '');

            // Insertar guiones automáticamente en las posiciones 2 y 11
            if (val.length > 2 && val[2] !== '-') val = val.slice(0, 2) + '-' + val.slice(2);
            if (val.length > 11 && val[11] !== '-') val = val.slice(0, 11) + '-' + val.slice(11);

            // Limitar a 13 caracteres (XX-XXXXXXXX-X)
            if (val.length > 13) val = val.slice(0, 13);

            inputCuit.value = val;
        });
    }
    // efectivo (1) y transferencia (3) no piden campos adicionales, así que no hacemos nada
}

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
        descuento: 0,
        iva: parseFloat(inputIVA.value) || 0
    }));

    const pago = {
        id_medio_pago: parseInt(metodoPago),
        monto: parseFloat(inputTotalVenta.value.replace(/[^\d.-]/g, '')) || 0
    };

    if (metodoPago === '2') { // tarjeta
        pago.cuit_cuil = document.getElementById('cuit_tarjeta')?.value || null;
        pago.fecha = new Date().toISOString().split('T')[0]; // fecha actual en formato yyyy-mm-dd
    }

    // para efectivo (1) y transferencia (3) no agregamos datos extras

    const datosVenta = {
        monto_total: pago.monto,
        tipo_comprobante: 'Factura A',
        nro_comprobante: '0001-00000001',
        id_iva: 1,
        id_usuario: 1,
        items: items,
        pagos: [pago]
    };

    fetch('http://localhost/Gestion-stock-tienda-motos/app/crear_venta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosVenta)
    })
        .then(res => {
            if (!res.ok) throw new Error('Error al registrar la venta');
            return res.json();
        })
        .then(data => {
            if (data.error) throw new Error(data.error + (data.detalle ? ': ' + data.detalle : ''));
            mensajeResultado.textContent = 'Venta registrada con éxito. ID: ' + data.id_venta;
            mensajeResultado.className = 'alert alert-success';

            productosVenta = [];
            actualizarTabla();
            actualizarTotales();
            selectMetodoPago.value = '';
            cambiarCamposMetodoPago();
            inputDescuento.value = '0';
            inputIVA.value = '21';
        })
        .catch(err => {
            console.error(err);
            mensajeResultado.textContent = 'Error al registrar la venta: ' + err.message;
            mensajeResultado.className = 'alert alert-danger';
        });
}

function cancelarVenta() {
    if (!confirm('¿Seguro que desea cancelar la venta? Se perderán los datos.')) return;
    productosVenta = [];
    actualizarTabla();
    actualizarTotales();
    selectMetodoPago.value = '';
    cambiarCamposMetodoPago();
    inputDescuento.value = '0';
    inputIVA.value = '21';
    mensajeResultado.textContent = '';
}

// Eventos
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    cargarMetodosPago();
    actualizarTotales();
});

botonAgregar.addEventListener('click', agregarProducto);
selectMetodoPago.addEventListener('change', cambiarCamposMetodoPago);
botonFinalizar.addEventListener('click', finalizarVenta);
botonCancelar.addEventListener('click', cancelarVenta);
