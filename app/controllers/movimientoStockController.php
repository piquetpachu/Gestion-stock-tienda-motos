<?php
require_once __DIR__ . '/../models/movimiento_stock.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../helpers/parsearRutas.php';
require_once __DIR__ . '/../helpers/middlewares.php';

switch (true) {
    case $ruta === 'movimientos_stock' && $metodo === 'GET':
        autorizar(['admin', 'vendedor']);
        echo json_encode(obtenerMovimientosStock($pdo));
        break;

    case $ruta === 'registrar_movimiento_stock' && $metodo === 'POST':
        autorizar(['admin', 'vendedor']);
        $datos = json_decode(file_get_contents('php://input'), true);
        echo json_encode(["id" => registrarMovimientoStock($pdo, $datos)]);
        break;

    default:
        echo json_encode(["error" => "Ruta no válida en movimiento_stock"]);
        break;
}
