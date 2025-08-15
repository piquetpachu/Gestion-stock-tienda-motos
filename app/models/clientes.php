<?php

function obtenerClientes($pdo) {
    $stmt = $pdo->query("SELECT * FROM cliente");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function obtenerClientePorId($pdo, $id) {
    $stmt = $pdo->prepare("SELECT * FROM cliente WHERE id_cliente = ?");
    $stmt->execute([$id]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function crearCliente($pdo, $datos) {
    $sql = "INSERT INTO cliente (nombre, apellido, dni, cuil_cuit, email, telefono, direccion) 
            VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $datos['nombre'],
        $datos['apellido'] ?? null,
        $datos['dni'],
        $datos['cuil_cuit'] ?? null,
        $datos['email'],
        $datos['telefono'] ?? null,
        $datos['direccion'] ?? null
    ]);
    return $pdo->lastInsertId();
}

function actualizarCliente($pdo, $id, $datos) {
    $sql = "UPDATE cliente SET 
            nombre = ?, 
            apellido = ?, 
            dni = ?, 
            cuil_cuit = ?, 
            email = ?, 
            telefono = ?, 
            direccion = ? 
            WHERE id_cliente = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $datos['nombre'],
        $datos['apellido'] ?? null,
        $datos['dni'],
        $datos['cuil_cuit'] ?? null,
        $datos['email'],
        $datos['telefono'] ?? null,
        $datos['direccion'] ?? null,
        $id
    ]);
    return $stmt->rowCount() > 0;
}

function borrarCliente($pdo, $id) {
    $stmt = $pdo->prepare("DELETE FROM cliente WHERE id_cliente = ?");
    $stmt->execute([$id]);
    return $stmt->rowCount() > 0;
}