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
let metodosPagoLista = []; // Para cargar métodos de pago y usar sus IDs

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
                opcion.value = metodo.id_medio_pago; // enviar ID para backend
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
            id_producto: producto.id_producto, // <-- agregar id_producto para backend
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

    if (metodo === 'tarjeta') {
        divCamposAdicionalesPago.innerHTML = `
      <div class="mb-3">
        <label for="num_tarjeta" class="form-label">Número de tarjeta</label>
        <input type="text" class="form-control" id="num_tarjeta" placeholder="Ej: 1234 5678 9012 3456">
      </div>
      <div class="mb-3">
        <label for="titular_tarjeta" class="form-label">Titular</label>
        <input type="text" class="form-control" id="titular_tarjeta" placeholder="Nombre completo del titular">
      </div>
      <div class="row">
        <div class="col-md-4 mb-3">
          <label for="vencimiento_tarjeta" class="form-label">Vencimiento</label>
          <input type="month" class="form-control" id="vencimiento_tarjeta">
        </div>
        <div class="col-md-4 mb-3">
          <label for="dni_tarjeta" class="form-label">DNI</label>
          <input type="text" class="form-control" id="dni_tarjeta" placeholder="DNI del titular">
        </div>
        <div class="col-md-4 mb-3">
          <label for="cvv_tarjeta" class="form-label">CVV</label>
          <input type="text" class="form-control" id="cvv_tarjeta" placeholder="Código de seguridad">
        </div>
      </div>
    `;
    } else if (metodo === 'cuenta_corriente') {
        divCamposAdicionalesPago.innerHTML = `
      <div class="mb-3">
        <label for="cuenta_cliente" class="form-label">Número de cuenta</label>
        <input type="text" class="form-control" id="cuenta_cliente" placeholder="Ej: 123456">
      </div>
      <div class="mb-3">
        <label for="nombre_cliente" class="form-label">Nombre del cliente</label>
        <input type="text" class="form-control" id="nombre_cliente" placeholder="Nombre completo">
      </div>
      <div class="mb-3">
        <label for="dni_cliente" class="form-label">DNI</label>
        <input type="text" class="form-control" id="dni_cliente" placeholder="DNI del cliente">
      </div>
      <div class="mb-3">
        <label for="telefono_cliente" class="form-label">Teléfono</label>
        <input type="tel" class="form-control" id="telefono_cliente" placeholder="Ej: 11 3456-7890">
      </div>
    `;
    }
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

    // Preparo items para backend con la estructura que espera PHP
    const items = productosVenta.map(p => ({
        id_producto: p.id_producto,
        cantidad: p.cantidad,
        precio_unitario: p.precio,
        descuento: 0,  // Podés cambiar si querés sumar campo para descuento por producto
        iva: parseFloat(inputIVA.value) || 0
    }));

    // Preparo pagos
    const pagos = [{
        id_medio_pago: parseInt(selectMetodoPago.value),
        monto: parseFloat(inputTotalVenta.value.replace(/[^\d.-]/g, '')) || 0
    }];

    // Datos extra requeridos por backend (ajustalos si querés)
    const datosVenta = {
        monto_total: parseFloat(inputTotalVenta.value.replace(/[^\d.-]/g, '')) || 0,
        tipo_comprobante: 'Factura A',
        nro_comprobante: '0001-00000001',
        id_iva: 1,
        id_usuario: 1,
        items: items,
        pagos: pagos
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
