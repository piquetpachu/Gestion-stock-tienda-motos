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
            try {
                $datos = json_decode(file_get_contents("php://input"), true);
                $id = crearUsuario($pdo, $datos);
                echo json_encode(["mensaje" => "Usuario creado", "id" => $id]);
            } catch (Exception $e) {
                http_response_code(400);
                echo json_encode(["error" => $e->getMessage()]);
            }
        }
        break;

    case 'login':
    if ($metodo === 'POST') {
        $datos = json_decode(file_get_contents("php://input"), true);
        $usuario = loginUsuario($pdo, $datos['email'], $datos['contrasena']);
        
        if ($usuario) {
            // Guardar datos en sesión (sin iniciar nuevamente)
            $_SESSION['usuario'] = [
                'id' => $usuario['id_usuario'],
                'nombre' => $usuario['nombre'],
                'email' => $usuario['email'],
                'rol' => $usuario['rol']
            ];
            
            // Regenerar ID para prevenir ataques
            session_regenerate_id(true);
            
            echo json_encode(["mensaje" => "Login exitoso"]);
        } else {
            http_response_code(401); // No autorizado
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
    case 'csrf-token':
    if ($metodo === 'GET') {
        require_once __DIR__ . '/../helpers/csrf.php';
        echo json_encode(['token' => generarCsrfToken()]);
    }
    break;
case 'usuario-info':
    if ($metodo === 'GET') {
        // REMOVER session_start() - Ya está iniciada en api.php
        
        if (isset($_SESSION['usuario'])) {
            $usuarioInfo = [
                'id' => $_SESSION['usuario']['id'],
                'nombre' => $_SESSION['usuario']['nombre'],
                'rol' => $_SESSION['usuario']['rol']
            ];
            echo json_encode($usuarioInfo);
        } else {
            http_response_code(401); // Código de error no autorizado
            echo json_encode(["error" => "No autenticado"]);
        }
    }
    break;
    case 'logout':
    if ($metodo === 'POST') {
        session_start();
        
        // Destruir completamente la sesión
        $_SESSION = [];
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(
                session_name(), 
                '', 
                time() - 42000,
                $params["path"], 
                $params["domain"],
                $params["secure"], 
                $params["httponly"]
            );
        }
        session_destroy();
        
        echo json_encode(["mensaje" => "Sesión cerrada"]);
    }
    break;
    case (preg_match('/^borrar_usuario\/(\d+)$/', $ruta, $matches) ? true : false):
        if ($metodo === 'DELETE') {
            $id = $matches[1];
            echo json_encode(borrarUsuario($pdo, $id));
        }
        break;
}
