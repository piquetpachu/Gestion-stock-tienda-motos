document.addEventListener("DOMContentLoaded", () => {
    const desde = document.getElementById("desde");
    const hasta = document.getElementById("hasta");
    const btnBuscar = document.getElementById("buscar");
    const resultados = document.getElementById("resultados");
    const resumen = document.getElementById("resumen");

    const formatoMoneda = valor =>
        Number(valor || 0).toLocaleString('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    const formatearFecha = f => new Date(f).toLocaleString();

    const orden = [
        "efectivo",
        "transferencia bancaria",
        "mercado pago",
        "tarjeta de crédito",
        "tarjeta de débito",
        "cuenta corriente",
    ];

    async function cargarHistorial() {
        const fDesde = desde.value;
        const fHasta = hasta.value;

        resultados.innerHTML = `<div class="text-center text-muted py-3">Cargando...</div>`;
        resumen.innerHTML = "";

        try {
            const res = await fetch(`http://localhost/Gestion-stock-tienda-motos/app/api.php/historial?desde=${fDesde}&hasta=${fHasta}`);
            if (!res.ok) throw new Error('Error al cargar historial');

            const response = await res.json();
            const data = response.datos || {};

            resultados.innerHTML = "";

            if (!data.ventas || data.ventas.length === 0) {
                resultados.innerHTML = `<div class="text-center text-muted py-3">No hay ventas en este rango.</div>`;
            } else {
                data.ventas.forEach(v => {
                    const div = document.createElement("div");
                    div.classList.add("venta-item", "mb-3", "p-3", "border", "rounded");
                    const pagos = v.pagos || [];

                    div.innerHTML = `
                        <div class="d-flex justify-content-between">
                            <div>
                                <b>Venta #${v.id}</b> <br>
                                <small>${formatearFecha(v.fecha)}</small>
                            </div>
                            <div class="text-end">
                                <b>Total:</b> ${formatoMoneda(parseFloat(String(v.total).replace(',', '.')))}
                            </div>
                        </div>
                        <div class="text-muted small mt-1">
                            ${pagos.length
                            ? pagos.map(p => {
                                const medio = p.medio_pago || "Sin medio";
                                const monto = parseFloat(String(p.monto || 0).replace(',', '.'));
                                return `${medio}: ${formatoMoneda(monto)}`;
                            }).join(" · ")
                            : "Sin pagos registrados"}
                        </div>
                    `;
                    resultados.appendChild(div);
                });
            }

            // Inicializar resumen con 0
            const resumenData = {};
            orden.forEach(m => resumenData[m] = 0);

            if (data.resumen) {
                Object.keys(data.resumen).forEach(m => {
                    const clave = m.toLowerCase();
                    if (resumenData.hasOwnProperty(clave)) {
                        // Reemplazar coma decimal si existiera
                        resumenData[clave] = parseFloat(String(data.resumen[m]).replace(',', '.')) || 0;
                    }
                });
            }

            // Renderizar resumen
            orden.forEach(m => {
                const li = document.createElement("li");
                li.className = "list-group-item d-flex justify-content-between align-items-center";
                li.innerHTML = `
                    <span class="text-capitalize">${m}</span>
                    <span class="badge bg-primary rounded-pill">${formatoMoneda(resumenData[m])}</span>
                `;
                resumen.appendChild(li);
            });

        } catch (error) {
            resultados.innerHTML = `<div class="text-danger text-center py-3">Error al cargar historial</div>`;
            console.error(error);
        }
    }

    btnBuscar.addEventListener("click", cargarHistorial);

    // Inicializar con la fecha de hoy
    const hoy = new Date().toISOString().split("T")[0];
    desde.value = hoy;
    hasta.value = hoy;
    cargarHistorial();
});
