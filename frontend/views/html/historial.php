<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Historial de Ventas</title>

    <!-- Bootstrap 5 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

    <style>
        body {
            background-color: #f8f9fa;
        }

        .card-scroll {
            max-height: 400px;
            overflow-y: auto;
        }

        .venta-item {
            border-bottom: 1px solid #dee2e6;
            padding: 10px 0;
        }

        .venta-item:last-child {
            border-bottom: none;
        }
    </style>
</head>

<body>

    <div class="container py-4">
        <h2 class="text-center mb-4">📜 Historial de Ventas</h2>

        <!-- FILTROS -->
        <div class="card shadow-sm mb-4">
            <div class="card-body">
                <form id="form_filtros" class="row g-3 align-items-end">
                    <div class="col-md-4">
                        <label for="desde" class="form-label">Desde:</label>
                        <input type="date" id="desde" name="desde" class="form-control">
                    </div>
                    <div class="col-md-4">
                        <label for="hasta" class="form-label">Hasta:</label>
                        <input type="date" id="hasta" name="hasta" class="form-control">
                    </div>
                    <div class="col-md-4 text-end">
                        <button type="button" id="buscar" class="btn btn-primary w-100">
                            <i class="bi bi-search"></i> Buscar
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- HISTORIAL -->
        <div class="card shadow-sm mb-4">
            <div class="card-header bg-primary text-white">
                Ventas registradas
            </div>
            <div class="card-body card-scroll" id="resultados">
                <div class="text-center text-muted">Seleccioná un rango de fechas o mostrará las de hoy.</div>
            </div>
        </div>

        <!-- RESUMEN MEDIOS -->
        <div class="card shadow-sm">
            <div class="card-header bg-secondary text-white">
                Resumen por medios de pago
            </div>
            <div class="card-body">
                <ul id="resumen" class="list-group">
                    <!-- Se llena con JS -->
                </ul>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

    <!-- Script de historial -->
    <script src="../js/historial.js"></script>

</body>

</html>