<?php

function obtenerMediosPago($pdo) {
    $stmt = $pdo->query("SELECT * FROM medio_pago");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function obtenerMedioPagoPorId($pdo, $id) {
    $stmt = $pdo->prepare("SELECT * FROM medio_pago WHERE id_medio_pago = ?");
    $stmt->execute([$id]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function crearMedioPago($pdo, $datos) {
    $stmt = $pdo->prepare("INSERT INTO medio_pago (descripcion) VALUES (?)");
    $stmt->execute([$datos['descripcion']]);
    return $pdo->lastInsertId();
}

function actualizarMedioPago($pdo, $id, $datos) {
    $stmt = $pdo->prepare("UPDATE medio_pago SET descripcion = ? WHERE id_medio_pago = ?");
    $stmt->execute([$datos['descripcion'], $id]);
    return $stmt->rowCount() > 0;
}

function borrarMedioPago($pdo, $id) {
    $stmt = $pdo->prepare("DELETE FROM medio_pago WHERE id_medio_pago = ?");
    $stmt->execute([$id]);
    return $stmt->rowCount() > 0;
}
