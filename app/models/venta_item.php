<?php

function obtenerItemsDeVenta($pdo, $idVenta) {
    $sql = "SELECT vi.*, p.nombre
            FROM venta_item vi
            JOIN producto p ON vi.id_producto = p.id_producto
            WHERE vi.id_venta = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$idVenta]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function agregarItemAVenta($pdo, $idVenta, $item) {
    $stmt = $pdo->prepare("INSERT INTO venta_item 
        (id_venta, id_producto, cantidad, precio_unitario, descuento, iva)
        VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $idVenta,
        $item['id_producto'],
        $item['cantidad'],
        $item['precio_unitario'],
        $item['descuento'] ?? 0,
        $item['iva'] ?? 0
    ]);

    // Actualizar stock
    $update = $pdo->prepare("UPDATE producto SET stock = stock - ? WHERE id_producto = ?");
    $update->execute([$item['cantidad'], $item['id_producto']]);

    return $pdo->lastInsertId();
}

function actualizarItemVenta($pdo, $idItem, $datos) {
    $sql = "UPDATE venta_item SET 
                cantidad = ?, 
                precio_unitario = ?, 
                descuento = ?, 
                iva = ? 
            WHERE id_venta_item = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $datos['cantidad'],
        $datos['precio_unitario'],
        $datos['descuento'] ?? 0,
        $datos['iva'] ?? 0,
        $idItem
    ]);
    return $stmt->rowCount() > 0;
}

function borrarItemVenta($pdo, $idItem) {
    $stmt = $pdo->prepare("DELETE FROM venta_item WHERE id_venta_item = ?");
    $stmt->execute([$idItem]);
    return $stmt->rowCount() > 0;
}
