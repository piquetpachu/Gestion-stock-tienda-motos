<?php
require_once __DIR__ . '/../../config/database.php';
require_once (__DIR__ . '/../models/usuarios.php');
require_once __DIR__ . '/../helpers/parsearRutas.php';



switch ($recurso) {
    case 'usuarios':
        if ($metodo === 'GET') echo json_encode(obtenerUsuarios($pdo));
        break;

    case 'usuario':
        if ($metodo === 'GET' && isset($partes[1])) {
            echo json_encode(obtenerUsuarioPorId($pdo, $partes[1]));
        }
        break;

    case 'registrar_usuario':
        if ($metodo === 'POST') {
            $datos = json_decode(file_get_contents("php://input"), true);
            $id = crearUsuario($pdo, $datos);
            echo json_encode(["mensaje" => "Usuario creado", "id" => $id]);
        }
        break;

    case 'login':
        if ($metodo === 'POST') {
            $datos = json_decode(file_get_contents("php://input"), true);
            $usuario = loginUsuario($pdo, $datos['email'], $datos['contrasena']);
            if ($usuario) {
                echo json_encode(["mensaje" => "Login exitoso", "usuario" => $usuario]);
            } else {
                echo json_encode(["error" => "Credenciales inválidas"]);
            }
        }
        break;

    case (preg_match('/^actualizar_usuario\/(\d+)$/', $ruta, $matches) ? true : false):
        if ($metodo === 'PUT') {
            $id = $matches[1];
            $datos = json_decode(file_get_contents("php://input"), true);
            echo json_encode(actualizarUsuario($pdo, $id, $datos));
        }
        break;

    case (preg_match('/^borrar_usuario\/(\d+)$/', $ruta, $matches) ? true : false):
        if ($metodo === 'DELETE') {
            $id = $matches[1];
            echo json_encode(borrarUsuario($pdo, $id));
        }
        break;
}
