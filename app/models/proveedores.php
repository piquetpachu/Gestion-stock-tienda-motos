<?php

function obtenerProveedores($pdo) {
    $stmt = $pdo->query("SELECT * FROM proveedor");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function obtenerProveedorPorId($pdo, $id) {
    $stmt = $pdo->prepare("SELECT * FROM proveedor WHERE id_proveedor = ?");
    $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
}

function crearProveedor($pdo, $datos) {
    $sql = "INSERT INTO proveedor (nombre, cuit, email, telefono, direccion) 
            VALUES (?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $datos['nombre'],
        $datos['cuit'] ?? null,
        $datos['email'] ?? null,
        $datos['telefono'] ?? null,
        $datos['direccion'] ?? null
    ]);
    return $pdo->lastInsertId();
}

function actualizarProveedor($pdo, $id, $datos) {
    $sql = "UPDATE proveedor SET 
            nombre = ?, 
            cuit = ?, 
            email = ?, 
            telefono = ?, 
            direccion = ? 
            WHERE id_proveedor = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $datos['nombre'],
        $datos['cuit'] ?? null,
        $datos['email'] ?? null,
        $datos['telefono'] ?? null,
        $datos['direccion'] ?? null,
        $id
    ]);
    return $stmt->rowCount() > 0;
}

function borrarProveedor($pdo, $id) {
    try {
        $stmt = $pdo->prepare("DELETE FROM proveedor WHERE id_proveedor = ?");
        $stmt->execute([$id]);
        return $stmt->rowCount() > 0;
    } catch (PDOException $e) {
        if ($e->getCode() === '23000') {
            // Clave foránea: hay productos u otros registros que dependen de este proveedor
            throw new Exception('No se puede borrar: el proveedor tiene productos u otros datos asociados.');
        }
        throw $e;
    }
}
