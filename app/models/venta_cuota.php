<?php

function obtenerCuotasDeVenta($pdo, $idVenta) {
    $stmt = $pdo->prepare("SELECT * FROM venta_cuota WHERE id_venta = ?");
    $stmt->execute([$idVenta]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function registrarCuota($pdo, $idVenta, $datos) {
    $stmt = $pdo->prepare("INSERT INTO venta_cuota 
        (id_venta, valor, fecha_venc, valor_venc, fecha_pago, valor_pago)
        VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $idVenta,
        $datos['valor'],
        $datos['fecha_venc'],
        $datos['valor_venc'] ?? null,
        $datos['fecha_pago'] ?? null,
        $datos['valor_pago'] ?? null
    ]);
    return $pdo->lastInsertId();
}

function actualizarCuota($pdo, $idCuota, $datos) {
    $stmt = $pdo->prepare("UPDATE venta_cuota SET 
        valor = ?, fecha_venc = ?, valor_venc = ?, fecha_pago = ?, valor_pago = ?
        WHERE id_cuota = ?");
    $stmt->execute([
        $datos['valor'],
        $datos['fecha_venc'],
        $datos['valor_venc'],
        $datos['fecha_pago'],
        $datos['valor_pago'],
        $idCuota
    ]);
    return $stmt->rowCount() > 0;
}

function borrarCuota($pdo, $idCuota) {
    $stmt = $pdo->prepare("DELETE FROM venta_cuota WHERE id_cuota = ?");
    $stmt->execute([$idCuota]);
    return $stmt->rowCount() > 0;
}
