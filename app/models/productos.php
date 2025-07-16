<?php
function obtenerProductos($pdo) {
    $stmt = $pdo->query("SELECT * FROM producto");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function obtenerProductoPorId($pdo, $id) {
    $stmt = $pdo->prepare("SELECT * FROM producto WHERE id_producto = ?");
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
    $sql = "INSERT INTO producto (nombre, descripcion, precio_venta, precio_compra, stock, id_proveedor, id_rubro, fecha_alta, activo, stock_minimo)
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?)";
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
        $datos['stock_minimo']
    ]);
    return $pdo->lastInsertId();
}

function actualizarProducto($pdo, $id, $datos) {
    $sql = "UPDATE producto SET
                nombre = ?, descripcion = ?, precio_venta = ?, precio_compra = ?, stock = ?,
                id_proveedor = ?, id_rubro = ?, activo = ?, stock_minimo = ?
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
        $id
    ]);
    return $stmt->rowCount() > 0;
}

function borrarProducto($pdo, $id) {
    $stmt = $pdo->prepare("DELETE FROM producto WHERE id_producto = ?");
    $stmt->execute([$id]);
    return $stmt->rowCount() > 0;
}
