<?php
function obtenerProductos($pdo) {
    $stmt = $pdo->query("SELECT * FROM producto");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function obtenerProductoPorId($pdo, $id) {
    $sql = "SELECT 
                p.id_producto,
                p.nombre,
                p.descripcion,
                p.precio_venta,
                p.precio_compra,
                p.stock,
                p.stock_minimo,
                p.codigo_barras,
                p.fecha_alta,
                p.activo,
                pr.nombre AS nombre_proveedor,
                r.nombre AS nombre_rubro
            FROM producto p
            LEFT JOIN proveedor pr ON p.id_proveedor = pr.id_proveedor
            LEFT JOIN rubro r ON p.id_rubro = r.id_rubro
            WHERE p.id_producto = ?";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$id]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}


function obtenerProductoPorCodigo($pdo, $codigo)
{
    $stmt = $pdo->prepare("SELECT * FROM producto WHERE codigo = ?");
    $stmt->execute([$codigo]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}


function crearProducto($pdo, $datos) {
    $sql = "INSERT INTO producto (
  nombre, descripcion, precio_venta, precio_compra, stock,
  id_proveedor, id_rubro, fecha_alta, activo, stock_minimo, codigo_barras
) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $datos['nombre'],
        $datos['descripcion'],
        $datos['precio_venta'],
        $datos['precio_compra'],
        $datos['stock'],
        $datos['id_proveedor'],
        $datos['id_rubro'],
        $datos['activo'],
        $datos['stock_minimo'],
        $datos['codigo_barras']
    ]);
    return $pdo->lastInsertId();
}

function actualizarProducto($pdo, $id, $datos) {
    $sql = "UPDATE producto SET
                nombre = ?, descripcion = ?, precio_venta = ?, precio_compra = ?, stock = ?,
                id_proveedor = ?, id_rubro = ?, activo = ?, stock_minimo = ?, codigo_barras = ?
            WHERE id_producto = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $datos['nombre'],
        $datos['descripcion'],
        $datos['precio_venta'],
        $datos['precio_compra'],
        $datos['stock'],
        $datos['id_proveedor'],
        $datos['id_rubro'],
        $datos['activo'],
        $datos['stock_minimo'],
        $datos['codigo_barras'],
        $id
    ]);
    return $stmt->rowCount() > 0;
}

function borrarProducto($pdo, $id) {
    $stmt = $pdo->prepare("DELETE FROM producto WHERE id_producto = ?");
    $stmt->execute([$id]);
    return $stmt->rowCount() > 0;
}
function obtenerEstadisticasProducto($pdo, $idProducto)
{
    // Consulta para obtener el total vendido, las ventas y los clientes que compraron el producto
    $sql = "
        SELECT
            vi.cantidad,
            vi.precio_unitario,
            v.fecha,
            c.nombre AS nombre_cliente,
            c.apellido AS apellido_cliente
        FROM venta_item vi
        JOIN venta v ON vi.id_venta = v.id_venta
        JOIN cliente c ON v.id_cliente = c.id_cliente
        WHERE vi.id_producto = ?
        ORDER BY v.fecha DESC;
    ";

    // Consulta para obtener el total de unidades vendidas y el total monetario
    $sqlTotales = "
        SELECT
            SUM(vi.cantidad) as total_unidades,
            SUM(vi.cantidad * vi.precio_unitario) as total_ventas
        FROM venta_item vi
        WHERE vi.id_producto = ?;
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$idProducto]);
    $ventas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $stmtTotales = $pdo->prepare($sqlTotales);
    $stmtTotales->execute([$idProducto]);
    $totales = $stmtTotales->fetch(PDO::FETCH_ASSOC);

    return [
        'totales' => $totales,
        'ventas_detalles' => $ventas
    ];
}