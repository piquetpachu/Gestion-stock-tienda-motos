<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestión de Clientes</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="cliente.css">
    <?php include 'navbar.php'; ?>
</head>
<body>

<div class="container my-4">

    <!-- Título -->
    <h2 class="mb-4 text-center">Gestión de Clientes</h2>

    <!-- Alta / Baja / Modificación -->
    <div class="card mb-4">
        <div class="card-header bg-primary text-white">
            Alta, Baja y Modificación
        </div>
        <div class="card-body">
            <form method="POST" action="cliente_backend.php">
                <div class="row mb-3">
                    <div class="col-md-4">
                        <label for="id_cliente" class="form-label">ID Cliente</label>
                        <input type="text" class="form-control" id="id_cliente" name="id_cliente" placeholder="ID para buscar o modificar">
                    </div>
                    <div class="col-md-8">
                        <label for="nombre" class="form-label">Nombre y Apellido</label>
                        <input type="text" class="form-control" id="nombre" name="nombre" placeholder="Ingrese el nombre del cliente" required>
                    </div>
                </div>

                <div class="mb-3">
                    <label for="direccion" class="form-label">Dirección</label>
                    <input type="text" class="form-control" id="direccion" name="direccion" placeholder="Calle, número, ciudad">
                </div>

                <div class="mb-3">
                    <label for="telefono" class="form-label">Teléfono</label>
                    <input type="text" class="form-control" id="telefono" name="telefono" placeholder="Ej: +54 11 5555-5555">
                </div>

                <div class="mb-3">
                    <label for="email" class="form-label">Correo Electrónico</label>
                    <input type="email" class="form-control" id="email" name="email" placeholder="ejemplo@correo.com">
                </div>

                <div class="d-flex gap-2">
                    <button type="submit" name="accion" value="alta" class="btn btn-success">Alta</button>
                    <button type="submit" name="accion" value="baja" class="btn btn-danger">Baja</button>
                    <button type="submit" name="accion" value="modificacion" class="btn btn-warning text-white">Modificación</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Historial de Compras -->
    <div class="card mb-4">
        <div class="card-header bg-secondary text-white">
            Historial de Compras
        </div>
        <div class="card-body">
            <table class="table table-striped table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>Fecha</th>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Ejemplo de fila, se reemplaza con datos del backend -->
                    <tr>
                        <td>2025-08-10</td>
                        <td>Producto A</td>
                        <td>2</td>
                        <td>$2000</td>
                    </tr>
                    <tr>
                        <td>2025-07-28</td>
                        <td>Producto B</td>
                        <td>1</td>
                        <td>$1500</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Datos de contacto -->
    <div class="card">
        <div class="card-header bg-info text-white">
            Datos de Contacto
        </div>
        <div class="card-body">
            <p><strong>Teléfono:</strong> <span id="contacto_telefono">+54 11 5555-5555</span></p>
            <p><strong>Email:</strong> <span id="contacto_email">cliente@correo.com</span></p>
            <p><strong>Dirección:</strong> <span id="contacto_direccion">Calle Falsa 123, Buenos Aires</span></p>
        </div>
    </div>
</div>
</body>
</html>