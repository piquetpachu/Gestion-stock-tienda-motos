<?php

function obtenerItemsCompra($pdo, $idCompra) {
    $sql = "SELECT ci.*, p.nombre 
            FROM compra_item ci
            JOIN producto p ON ci.id_producto = p.id_producto
            WHERE ci.id_compra = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$idCompra]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function borrarItemCompra($pdo, $idItem) {
    $stmt = $pdo->prepare("DELETE FROM compra_item WHERE id_compra_item = ?");
    $stmt->execute([$idItem]);
    return $stmt->rowCount() > 0;
}
