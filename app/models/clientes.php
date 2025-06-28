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
    $sql = "INSERT INTO cliente (nombre, email, telefono, direccion, dni) VALUES (?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $datos['nombre'],
        $datos['email'],
        $datos['telefono'],
        $datos['direccion'],
        $datos['dni']
    ]);
    return $pdo->lastInsertId();
}

function actualizarCliente($pdo, $id, $datos) {
    $sql = "UPDATE cliente SET nombre = ?, email = ?, telefono = ?, direccion = ?, dni = ? WHERE id_cliente = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $datos['nombre'],
        $datos['email'],
        $datos['telefono'],
        $datos['direccion'],
        $datos['dni'],
        $id
    ]);
    return $stmt->rowCount() > 0;
}

function borrarCliente($pdo, $id) {
    $stmt = $pdo->prepare("DELETE FROM cliente WHERE id_cliente = ?");
    $stmt->execute([$id]);
    return $stmt->rowCount() > 0;
}
