<?php

function obtenerMovimientosStock($pdo) {
    $stmt = $pdo->query("SELECT m.*, p.nombre AS producto 
                         FROM movimiento_stock m
                         JOIN producto p ON m.id_producto = p.id_producto
                         ORDER BY m.fecha DESC");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function registrarMovimientoStock($pdo, $datos) {
    $stmt = $pdo->prepare("INSERT INTO movimiento_stock (id_producto, tipo, cantidad, fecha, motivo)
                           VALUES (?, ?, ?, NOW(), ?)");
    $stmt->execute([
        $datos['id_producto'],
        $datos['tipo'],
        $datos['cantidad'],
        $datos['motivo']
    ]);
    return $pdo->lastInsertId();
}
