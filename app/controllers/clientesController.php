<?php
require_once __DIR__ . '/../models/clientes.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../helpers/parsearRutas.php';
require_once __DIR__ . '/../helpers/middlewares.php';

header('Content-Type: application/json');

try {
    switch (true) {
        case $ruta === 'clientes' && $metodo === 'GET':
            autorizar(['admin', 'vendedor']);
            echo json_encode(obtenerClientes($pdo));
            break;

        case preg_match('/^cliente\/(\d+)$/', $ruta, $matches) && $metodo === 'GET':
            autorizar(['admin', 'vendedor']);
            echo json_encode(obtenerClientePorId($pdo, $matches[1]));
            break;

        case $ruta === 'crear_cliente' && $metodo === 'POST':
            autorizar(['admin']);
            $datos = json_decode(file_get_contents('php://input'), true);
            if (empty($datos['nombre']) || empty($datos['dni']) || empty($datos['email'])) {
                throw new Exception("Nombre, DNI y Email son campos requeridos");
            }
            echo json_encode(["id" => crearCliente($pdo, $datos)]);
            break;

        case preg_match('/^actualizar_cliente\/(\d+)$/', $ruta, $matches) && $metodo === 'PUT':
            autorizar(['admin']);
            $datos = json_decode(file_get_contents('php://input'), true);
            if (empty($datos['nombre']) || empty($datos['dni']) || empty($datos['email'])) {
                throw new Exception("Nombre, DNI y Email son campos requeridos");
            }
            echo json_encode(actualizarCliente($pdo, $matches[1], $datos));
            break;

        case preg_match('/^borrar_cliente\/(\d+)$/', $ruta, $matches) && $metodo === 'DELETE':
            autorizar(['admin']);
            echo json_encode(borrarCliente($pdo, $matches[1]));
            break;

        default:
            http_response_code(404);
            echo json_encode(["error" => "Endpoint no encontrado"]);
            break;
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["error" => $e->getMessage()]);
}