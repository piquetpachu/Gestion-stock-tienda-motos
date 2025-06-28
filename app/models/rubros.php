<?php

function obtenerRubros($pdo) {
    $stmt = $pdo->query("SELECT * FROM rubro");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function obtenerRubroPorId($pdo, $id) {
    $stmt = $pdo->prepare("SELECT * FROM rubro WHERE id_rubro = ?");
    $stmt->execute([$id]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function crearRubro($pdo, $datos) {
    $stmt = $pdo->prepare("INSERT INTO rubro (nombre) VALUES (?)");
    $stmt->execute([$datos['nombre']]);
    return $pdo->lastInsertId();
}

function actualizarRubro($pdo, $id, $datos) {
    $stmt = $pdo->prepare("UPDATE rubro SET nombre = ? WHERE id_rubro = ?");
    $stmt->execute([$datos['nombre'], $id]);
    return $stmt->rowCount() > 0;
}

function borrarRubro($pdo, $id) {
    $stmt = $pdo->prepare("DELETE FROM rubro WHERE id_rubro = ?");
    $stmt->execute([$id]);
    return $stmt->rowCount() > 0;
}
