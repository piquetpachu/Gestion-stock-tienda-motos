<?php
require_once __DIR__ . '/../models/movimiento_stock.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../helpers/parsearRutas.php';


switch (true) {
    case $ruta === 'movimientos_stock' && $metodo === 'GET':
        echo json_encode(obtenerMovimientosStock($pdo));
        break;

    case $ruta === 'registrar_movimiento_stock' && $metodo === 'POST':
        $datos = json_decode(file_get_contents('php://input'), true);
        echo json_encode(["id" => registrarMovimientoStock($pdo, $datos)]);
        break;

    default:
        echo json_encode(["error" => "Ruta no válida en movimiento_stock"]);
        break;
}
