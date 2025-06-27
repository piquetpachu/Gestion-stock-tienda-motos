<?php
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$basePath = '/Gestion-stock-tienda-motos/app/';
$ruta = str_replace($basePath, '', $uri);
$partes = explode('/', trim($ruta, '/'));
$recurso = $partes[0] ?? null;

// Reenviamos a cada archivo de rutas
switch ($recurso) {
    case 'productos':
    case 'producto':
    case 'crear_producto':
    case (preg_match('/^actualizar_producto\/\d+$/', $ruta) ? true : false):
    case (preg_match('/^borrar_producto\/\d+$/', $ruta) ? true : false):
        require_once __DIR__ . '/../controllers/productosController.php';
        break;

    case 'usuarios':
    case 'usuario':
    case 'crear_usuario':
    case 'login':
    case (preg_match('/^actualizar_usuario\/\d+$/', $ruta) ? true : false):
    case (preg_match('/^borrar_usuario\/\d+$/', $ruta) ? true : false):
        require_once __DIR__ . '/usuarios.php';
        break;

    default:
        echo json_encode(["error" => "Ruta no válida"]);
        break;
}
