<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../models/productos.php';
require_once __DIR__ . '/../helpers/parsearRutas.php';
require_once __DIR__ . '/../helpers/middlewares.php';

switch (true) {
    case $ruta === 'productos' && $metodo === 'GET':
        autorizar(['admin', 'vendedor']);
        echo json_encode(obtenerProductos($pdo));
        break;

    case preg_match('/^producto\/(\d+)$/', $ruta, $matches) && $metodo === 'GET':
        autorizar(['admin', 'vendedor']);
        $id = $matches[1];
        echo json_encode(obtenerProductoPorId($pdo, $id));
        break;

    case $ruta === 'crear_producto' && $metodo === 'POST':
        autorizar(['admin']);
        $datos = json_decode(file_get_contents('php://input'), true);
        if ($datos) {
            $id = crearProducto($pdo, $datos);
            echo json_encode(["mensaje" => "Producto creado", "id" => $id]);
        } else {
            echo json_encode(["error" => "Datos inválidos"]);
        }
        break;

    case preg_match('/^actualizar_producto\/(\d+)$/', $ruta, $matches) && $metodo === 'PUT':
        autorizar(['admin']);
        $id = $matches[1];
        $datos = json_decode(file_get_contents('php://input'), true);
        echo json_encode(actualizarProducto($pdo, $id, $datos));
        break;

    case preg_match('/^borrar_producto\/(\d+)$/', $ruta, $matches) && $metodo === 'DELETE':
        autorizar(['admin']);
        echo json_encode(borrarProducto($pdo, $matches[1]));
        break;

    default:
        echo json_encode(["error" => "Ruta no válida en productos"]);
        break;
}
