const form = document.getElementById('formVenta');
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const datos = {
        cliente_id: form.cliente_id.value,
        productos: [
            {
                producto_id: form['producto_id[]'].value,
                cantidad: form['cantidad[]'].value
            }
        ],
        medio_pago: form.medio_pago.value
    };

    try {
        const respuesta = await fetch('/Gestion-stock-tienda-motos/app/controllers/ventasController.php?ruta=crear_venta', {

            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        const json = await respuesta.json();
        document.getElementById('resultado').innerText = JSON.stringify(json);
    } catch (error) {
        document.getElementById('resultado').innerText = 'Error al enviar la venta.';
    }
});
