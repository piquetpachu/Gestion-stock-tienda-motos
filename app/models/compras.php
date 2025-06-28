<?php

function obtenerCompras($pdo) {
    $stmt = $pdo->query("SELECT * FROM compra ORDER BY fecha DESC");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function obtenerCompraPorId($pdo, $id) {
    $stmt = $pdo->prepare("SELECT * FROM compra WHERE id_compra = ?");
    $stmt->execute([$id]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function crearCompra($pdo, $datos) {
    $pdo->beginTransaction();

    try {
        $stmt = $pdo->prepare("INSERT INTO compra (fecha, total, id_proveedor, id_usuario)
                               VALUES (NOW(), ?, ?, ?)");
        $stmt->execute([
            $datos['total'],
            $datos['id_proveedor'],
            $datos['id_usuario']
        ]);

        $idCompra = $pdo->lastInsertId();

        foreach ($datos['items'] as $item) {
            $stmtItem = $pdo->prepare("INSERT INTO compra_item 
                (id_compra, id_producto, cantidad, precio_unitario) 
                VALUES (?, ?, ?, ?)");
            $stmtItem->execute([
                $idCompra,
                $item['id_producto'],
                $item['cantidad'],
                $item['precio_unitario']
            ]);

            // Aumentar stock
            $stmtStock = $pdo->prepare("UPDATE producto SET stock = stock + ? WHERE id_producto = ?");
            $stmtStock->execute([
                $item['cantidad'],
                $item['id_producto']
            ]);
        }

        $pdo->commit();
        return $idCompra;

    } catch (Exception $e) {
        $pdo->rollBack();
        return ["error" => "Error al registrar la compra", "detalle" => $e->getMessage()];
    }
}

function borrarCompra($pdo, $id) {
    $stmt = $pdo->prepare("DELETE FROM compra WHERE id_compra = ?");
    $stmt->execute([$id]);
    return $stmt->rowCount() > 0;
}
