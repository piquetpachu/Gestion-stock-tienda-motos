<?php

// Obtener todos los usuarios
function obtenerUsuarios($pdo)
{
    $stmt = $pdo->query("SELECT id_usuario, nombre, email, rol FROM usuario");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// Obtener usuario por ID
function obtenerUsuarioPorId($pdo, $id)
{
    $stmt = $pdo->prepare("SELECT id_usuario, nombre, email, rol FROM usuario WHERE id_usuario = ?");
    $stmt->execute([$id]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

// Crear usuario con contraseña encriptada
function crearUsuario($pdo, $datos)
{
    // 1. Verificar si el email ya existe
    $stmt = $pdo->prepare("SELECT id_usuario FROM usuario WHERE email = ?");
    $stmt->execute([$datos['email']]);

    if ($stmt->fetch()) {
        throw new Exception("El email ya está registrado");
    }

    // 2. Verificar duplicados de nombre si es necesario
    if (isset($datos['nombre'])) {
        $stmt = $pdo->prepare("SELECT id_usuario FROM usuario WHERE nombre = ?");
        $stmt->execute([$datos['nombre']]);

        if ($stmt->fetch()) {
            throw new Exception("El nombre de usuario ya existe");
        }
    }

    // 3. Si todo está bien, crear el usuario
    $hash = password_hash($datos['contrasena'], PASSWORD_BCRYPT);

    $sql = "INSERT INTO usuario (nombre, email, contrasena, rol)
            VALUES (?, ?, ?, ?)";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $datos['nombre'],
        $datos['email'],
        $hash,
        $datos['rol']
    ]);

    return $pdo->lastInsertId();
}

// Verificar login
function loginUsuario($pdo, $email, $contrasena)
{
    $stmt = $pdo->prepare("SELECT * FROM usuario WHERE email = ?");
    $stmt->execute([$email]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($usuario && password_verify($contrasena, $usuario['contrasena'])) {
        // Devolver solo datos necesarios para sesión
        return [
            'id_usuario' => $usuario['id_usuario'],
            'nombre' => $usuario['nombre'],
            'email' => $usuario['email'],
            'rol' => $usuario['rol']
        ];
    }
    return false;
}

// Actualizar usuario (con opción a cambiar contraseña si viene)
function actualizarUsuario($pdo, $id, $datos)
{
    if (isset($datos['contrasena'])) {
        $hash = password_hash($datos['contrasena'], PASSWORD_BCRYPT);
    }

    $sql = "UPDATE usuario SET
            nombre = ?,
            email = ?,
            rol = ?" . (isset($datos['contrasena']) ? ", contrasena = ?" : "") . "
            WHERE id_usuario = ?";

    $params = [
        $datos['nombre'],
        $datos['email'],
        $datos['rol']
    ];

    if (isset($datos['contrasena'])) $params[] = $hash;
    $params[] = $id;

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    return $stmt->rowCount() > 0
        ? ["mensaje" => "Usuario actualizado"]
        : ["error" => "No se pudo actualizar (verificá el ID o los datos)"];
}

// Eliminar usuario
function borrarUsuario($pdo, $id)
{
    $stmt = $pdo->prepare("DELETE FROM usuario WHERE id_usuario = ?");
    $stmt->execute([$id]);

    return $stmt->rowCount() > 0
        ? ["mensaje" => "Usuario eliminado"]
        : ["error" => "Usuario no encontrado"];
}
