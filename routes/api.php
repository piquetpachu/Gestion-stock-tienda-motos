<?php
require_once (__DIR__ . '/../config/database.php');
require_once (__DIR__ . '/../app/models/productos.php');

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$basePath = 'Gestion-stock-tienda-motos';
$ruta = str_replace($basePath, '', $uri);

$partes = explode('/', trim($ruta, '/'));
$recurso = $partes[0] ?? null;
$metodo = $_SERVER['REQUEST_METHOD'];

// 🛣️ Rutas legibles
switch ($recurso) {
    case 'productos':
        if ($metodo === 'GET') {
            echo json_encode(obtenerProductos($pdo));
        }
        break;

    case 'producto':
        if ($metodo === 'GET' && isset($partes[1])) {
            $id = $partes[1];
            echo json_encode(obtenerProductoPorId($pdo, $id));
        }
        break;

    case 'crear_producto':
        if ($metodo === 'POST') {
            $datos = json_decode(file_get_contents('php://input'), true);
            if ($datos) {
                $id = crearProducto($pdo, $datos);
                echo json_encode(["mensaje" => "Producto creado", "id" => $id]);
            } else {
                echo json_encode(["error" => "Datos inválidos"]);
            }
        }
        break;

    case (preg_match('/^actualizar_producto\/(\d+)$/', $ruta, $matches) ? true : false):
        if ($metodo === 'PUT') {
            $id = $matches[1];
            $datos = json_decode(file_get_contents('php://input'), true);
            if ($datos) {
                echo json_encode(actualizarProducto($pdo, $id, $datos));
            } else {
                echo json_encode(["error" => "Datos inválidos"]);
            }
        }
        break;

    case (preg_match('/^borrar_producto\/(\d+)$/', $ruta, $matches) ? true : false):
        if ($metodo === 'DELETE') {
            $id = $matches[1];
            echo json_encode(borrarProducto($pdo, $id));
        }
        break;

    default:
        echo json_encode(["error" => "Ruta no válida"]);
        break;
}
