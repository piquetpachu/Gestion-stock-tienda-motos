<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Historial de Ventas</title>

    <!-- Bootstrap 5 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="../css/style.css">
</head>

<body>
    <?php include 'navbar.php'; ?>

    <div class="container page-container">
        <div class="page-card">
            <!-- PAGE HEADER -->
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h1 class="d-flex align-items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="title-icon" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                        <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022zm2.004.45a7 7 0 0 0-.985-.299l.219-.976q.576.129 1.126.342zm1.37.71a7 7 0 0 0-.439-.27l.493-.87a8 8 0 0 1 .979.654l-.615.789a7 7 0 0 0-.418-.302zm1.834 1.79a7 7 0 0 0-.653-.796l.724-.69q.406.429.747.91zm.744 1.352a7 7 0 0 0-.214-.468l.893-.45a8 8 0 0 1 .45 1.088l-.95.313a7 7 0 0 0-.179-.483m.53 2.507a7 7 0 0 0-.1-1.025l.985-.17q.1.58.116 1.17zm-.131 1.538q.05-.254.081-.51l.993.123a8 8 0 0 1-.23 1.155l-.964-.267q.069-.247.12-.501m-.952 2.379q.276-.436.486-.908l.914.405q-.24.54-.555 1.038zm-.964 1.205q.183-.183.35-.378l.758.653a8 8 0 0 1-.401.432z"/>
                        <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0z"/>
                        <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5"/>
                    </svg>
                    Historial de Ventas
                </h1>
            </div>

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
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

    <!-- Scripts -->
    <script src="../js/theme.js"></script>
    <script src="../js/config.js"></script>
    <script src="../js/dashboard-proteccion.js"></script>
    <script src="../js/historial.js"></script>

</body>

</html>