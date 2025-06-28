<?php
require_once __DIR__ . '/../models/venta_cuota.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../helpers/parsearRutas.php';


switch (true) {
    case preg_match('/^cuotas\/(\d+)$/', $ruta, $matches) && $metodo === 'GET':
        echo json_encode(obtenerCuotasDeVenta($pdo, $matches[1]));
        break;

    case preg_match('/^crear_cuota\/(\d+)$/', $ruta, $matches) && $metodo === 'POST':
        $datos = json_decode(file_get_contents('php://input'), true);
        echo json_encode(registrarCuota($pdo, $matches[1], $datos));
        break;

    case preg_match('/^actualizar_cuota\/(\d+)$/', $ruta, $matches) && $metodo === 'PUT':
        $datos = json_decode(file_get_contents('php://input'), true);
        echo json_encode(actualizarCuota($pdo, $matches[1], $datos));
        break;

    case preg_match('/^borrar_cuota\/(\d+)$/', $ruta, $matches) && $metodo === 'DELETE':
        echo json_encode(borrarCuota($pdo, $matches[1]));
        break;

    default:
        echo json_encode(["error" => "Ruta no válida en venta_cuota"]);
        break;
}
