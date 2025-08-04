<?php

function obtenerproveedor($pdo) {
    $stmt = $pdo->query("SELECT id_proveedor, nombre FROM proveedor");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}