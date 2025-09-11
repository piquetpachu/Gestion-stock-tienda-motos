<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Administrar Rubros y Proveedores</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>
<?php
// Mostrar errores durante el desarrollo para ver problemas de include/u otros errores PHP
ini_set('display_errors', 1);
error_reporting(E_ALL);
?>
    <?php include 'navbar.php'; ?>

    <div class="container my-5">
    <h1 class="mb-4">Administrar Rubros y Proveedores</h1>

    <div class="row">
    <div class="col-md-6">
        <div class="card mb-3">
        <div class="card-header d-flex justify-content-between align-items-center">
            <span>Rubros</span>
            <button class="btn btn-sm btn-primary" data-bs-toggle="collapse" data-bs-target="#nuevoRubroCollapse">Nuevo Rubro</button>
        </div>
        <div class="card-body">
            <div id="nuevoRubroCollapse" class="collapse mb-3">
            <form id="form-nuevo-rubro-adm" class="d-flex gap-2">
                <input name="rubro_nombre" class="form-control" placeholder="Nombre del rubro" required>
                <button class="btn btn-success">Agregar</button>
            </form>
            </div>

            <div id="listaRubros" aria-live="polite"></div>
        </div>
        </div>
    </div>

    <div class="col-md-6">
        <div class="card mb-3">
        <div class="card-header d-flex justify-content-between align-items-center">
            <span>Proveedores</span>
            <button class="btn btn-sm btn-primary" data-bs-toggle="collapse" data-bs-target="#nuevoProveedorCollapse">Nuevo Proveedor</button>
        </div>
        <div class="card-body">
            <div id="nuevoProveedorCollapse" class="collapse mb-3">
            <form id="form-nuevo-proveedor-adm" class="row g-2">
                <div class="col-6">
                <input name="proveedor_nombre" class="form-control" placeholder="Nombre" required>
                </div>
                <div class="col-4">
                <input name="proveedor_email" class="form-control" placeholder="Email (opcional)">
                </div>
                <div class="col-2">
                <button class="btn btn-success w-100">Agregar</button>
                </div>
            </form>
            </div>

            <div id="listaProveedores" aria-live="polite"></div>
        </div>
        </div>
    </div>
    </div>

    <p class="text-muted small">
    <a href="app/routes/api.php">app/routes/api.php</a>.
    <a href="app/models/rubros.php">app/models/rubros.php</a>.
    </p>

<!-- definir API_URL global antes de cargar el script -->
<script>
    // Ajusta la URL según cómo sirvas la API en tu servidor local.
    // Ejemplo para XAMPP si el proyecto está en htdocs/Gestion-stock-tienda-motos:
    window.API_URL = '/Gestion-stock-tienda-motos/app/routes/api.php/';
</script>
<script src="../js/AdmRubroProveedores.js"></script>
</body>
</html>
