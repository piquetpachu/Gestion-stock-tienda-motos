<?php
require_once __DIR__ . '/../models/medio_pago.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../helpers/parsearRutas.php';


switch (true) {
    case $ruta === 'medios_pago' && $metodo === 'GET':
        echo json_encode(obtenerMediosPago($pdo));
        break;

    case preg_match('/^medio_pago\/(\d+)$/', $ruta, $matches) && $metodo === 'GET':
        echo json_encode(obtenerMedioPagoPorId($pdo, $matches[1]));
        break;

    case $ruta === 'crear_medio_pago' && $metodo === 'POST':
        $datos = json_decode(file_get_contents('php://input'), true);
        echo json_encode(["id" => crearMedioPago($pdo, $datos)]);
        break;

    case preg_match('/^actualizar_medio_pago\/(\d+)$/', $ruta, $matches) && $metodo === 'PUT':
        $datos = json_decode(file_get_contents('php://input'), true);
        echo json_encode(actualizarMedioPago($pdo, $matches[1], $datos));
        break;

    case preg_match('/^borrar_medio_pago\/(\d+)$/', $ruta, $matches) && $metodo === 'DELETE':
        echo json_encode(borrarMedioPago($pdo, $matches[1]));
        break;

    default:
        echo json_encode(["error" => "Ruta no válida en medio_pago"]);
        break;
}
