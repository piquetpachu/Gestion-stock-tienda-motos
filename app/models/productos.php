<?php
require_once (__DIR__.'/../../config/database.php');

// Obtener todos los productos
function obtenerProductos($pdo) {
    $stmt = $pdo->query("SELECT * FROM producto");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// Obtener producto por ID
function obtenerProductoPorId($pdo, $id) {
    $stmt = $pdo->prepare("SELECT * FROM producto WHERE id_producto = ?");
    $stmt->execute([$id]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

// Crear un producto
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

// Actualizar un producto
function actualizarProducto($pdo, $id, $datos) {
    $sql = "UPDATE producto SET
                nombre = ?, 
                descripcion = ?, 
                precio_venta = ?, 
                precio_compra = ?, 
                stock = ?, 
                id_proveedor = ?, 
                id_rubro = ?, 
                activo = ?, 
                stock_minimo = ?, 
                codigo_barras = ?
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

    if ($stmt->rowCount() > 0) {
        return ["mensaje" => "Producto actualizado correctamente"];
    } else {
        return ["error" => "No se pudo actualizar (verificá el ID o si hay cambios)"];
    }
}

// Eliminar un producto
function borrarProducto($pdo, $id) {
    $stmt = $pdo->prepare("DELETE FROM producto WHERE id_producto = ?");
    $stmt->execute([$id]);

    if ($stmt->rowCount() > 0) {
        return ["mensaje" => "Producto eliminado correctamente"];
    } else {
        return ["error" => "No se encontró el producto"];
    }
}
?>
