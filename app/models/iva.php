<?php

function obtenerIvas($pdo) {
    $stmt = $pdo->query("SELECT * FROM iva");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function obtenerIvaPorId($pdo, $id) {
    $stmt = $pdo->prepare("SELECT * FROM iva WHERE id_iva = ?");
    $stmt->execute([$id]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function crearIva($pdo, $datos) {
    $stmt = $pdo->prepare("INSERT INTO iva (descripcion, porcentaje) VALUES (?, ?)");
    $stmt->execute([$datos['descripcion'], $datos['porcentaje']]);
    return $pdo->lastInsertId();
}

function actualizarIva($pdo, $id, $datos) {
    $stmt = $pdo->prepare("UPDATE iva SET descripcion = ?, porcentaje = ? WHERE id_iva = ?");
    $stmt->execute([$datos['descripcion'], $datos['porcentaje'], $id]);
    return $stmt->rowCount() > 0;
}

function borrarIva($pdo, $id) {
    $stmt = $pdo->prepare("DELETE FROM iva WHERE id_iva = ?");
    $stmt->execute([$id]);
    return $stmt->rowCount() > 0;
}
