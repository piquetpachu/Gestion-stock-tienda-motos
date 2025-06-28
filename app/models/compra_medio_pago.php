<?php

function obtenerMediosPagoCompra($pdo, $idCompra) {
    $stmt = $pdo->prepare("SELECT cmp.*, mp.descripcion AS medio
                           FROM compra_medio_pago cmp
                           JOIN medio_pago mp ON cmp.id_medio_pago = mp.id_medio_pago
                           WHERE cmp.id_compra = ?");
    $stmt->execute([$idCompra]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function agregarMedioPagoCompra($pdo, $idCompra, $datos) {
    $stmt = $pdo->prepare("INSERT INTO compra_medio_pago (id_compra, id_medio_pago, monto) VALUES (?, ?, ?)");
    $stmt->execute([
        $idCompra,
        $datos['id_medio_pago'],
        $datos['monto']
    ]);
    return $pdo->lastInsertId();
}

function borrarMedioPagoCompra($pdo, $id) {
    $stmt = $pdo->prepare("DELETE FROM compra_medio_pago WHERE id_compra_medio_pago = ?");
    $stmt->execute([$id]);
    return $stmt->rowCount() > 0;
}
