<?php
require_once __DIR__ . '/../models/compra_medio_pago.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../helpers/parsearRutas.php';


switch (true) {
    case preg_match('/^compra_medios_pago\/(\d+)$/', $ruta, $matches) && $metodo === 'GET':
        echo json_encode(obtenerMediosPagoCompra($pdo, $matches[1]));
        break;

    case preg_match('/^agregar_compra_medio_pago\/(\d+)$/', $ruta, $matches) && $metodo === 'POST':
        $datos = json_decode(file_get_contents('php://input'), true);
        echo json_encode(["id" => agregarMedioPagoCompra($pdo, $matches[1], $datos)]);
        break;

    case preg_match('/^borrar_compra_medio_pago\/(\d+)$/', $ruta, $matches) && $metodo === 'DELETE':
        echo json_encode(borrarMedioPagoCompra($pdo, $matches[1]));
        break;

    default:
        echo json_encode(["error" => "Ruta no válida en compra_medio_pago"]);
        break;
}
