<?php
require_once __DIR__ . '/../models/venta_medio_pago.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../helpers/parsearRutas.php';
require_once __DIR__ . '/../helpers/middlewares.php';


switch (true) {
    case preg_match('/^venta_medios_pago\/(\d+)$/', $ruta, $matches) && $metodo === 'GET':
        autorizar(['admin', 'vendedor']);
        echo json_encode(obtenerMediosPagoVenta($pdo, $matches[1]));
        break;

    case preg_match('/^agregar_venta_medio_pago\/(\d+)$/', $ruta, $matches) && $metodo === 'POST':
        autorizar(['admin']);
        $datos = json_decode(file_get_contents('php://input'), true);
        echo json_encode(agregarMedioPago($pdo, $matches[1], $datos));
        break;

    case preg_match('/^borrar_venta_medio_pago\/(\d+)$/', $ruta, $matches) && $metodo === 'DELETE':
        autorizar(['admin']);
        echo json_encode(borrarMedioPago($pdo, $matches[1]));
        break;

    default:
        echo json_encode(["error" => "Ruta no válida en venta_medio_pago"]);
        break;
}
