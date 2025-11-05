<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../models/ventas.php';
require_once __DIR__ . '/../helpers/parsearRutas.php';
require_once __DIR__ . '/../helpers/middlewares.php';

switch (true) {
    case $ruta === 'ventas' && $metodo === 'GET':
        autorizar(['admin', 'vendedor']);
        echo json_encode(obtenerVentas($pdo));
        break;

    case preg_match('/^venta\/(\d+)$/', $ruta, $matches) && $metodo === 'GET':
        autorizar(['admin', 'vendedor']);
        echo json_encode(obtenerVentaPorId($pdo, $matches[1]));
        break;

    case preg_match('/^detalle_venta\/(\d+)$/', $ruta, $matches) && $metodo === 'GET':
        autorizar(['admin', 'vendedor']);
        echo json_encode(obtenerDetalleVenta($pdo, $matches[1]));
        break;

    case $ruta === 'crear_venta' && $metodo === 'POST':
    autorizar(['admin', 'vendedor']);
    $datos = json_decode(file_get_contents('php://input'), true);

    // Crear la venta normalmente
    $resultado = crearVenta($pdo, $datos);

    // Si la venta devolvió un error, responder con 500 para que el frontend lo detecte
    if (isset($resultado['error'])) {
        http_response_code(500);
        echo json_encode($resultado);
        break;
    }

    // Las cuotas ya son generadas en el modelo (crearVenta -> crearCuotas).
    // Evitamos generar cuotas nuevamente desde aquí para no duplicar registros.

    echo json_encode($resultado);
    break;


    case preg_match('/^borrar_venta\/(\d+)$/', $ruta, $matches) && $metodo === 'DELETE':
        autorizar(['admin', 'vendedor']);
        echo json_encode(borrarVenta($pdo, $matches[1]));
        break;

    default:
        echo json_encode(["error" => "Ruta no válida en ventas"]);
        break;
}
