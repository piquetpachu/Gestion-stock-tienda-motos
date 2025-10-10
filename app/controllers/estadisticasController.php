<?php
require_once __DIR__ . '/../models/estadisticas.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../helpers/parsearRutas.php';
require_once __DIR__ . '/../helpers/middlewares.php';

switch (true) {
    case $ruta === 'estadisticas' && $metodo === 'GET':
        autorizar(['admin', 'vendedor']);
        echo json_encode(obtenerResumenEstadisticas($pdo));
        break;

    case $ruta === 'top_productos' && $metodo === 'GET':
        autorizar(['admin','vendedor']);
        echo json_encode(obtenerTopProductos($pdo));
        break;

    case $ruta === 'ventas_por_dia' && $metodo === 'GET':
        autorizar(['admin','vendedor']);
        $desde = $_GET['desde'] ?? null;
        $hasta = $_GET['hasta'] ?? null;
        echo json_encode(obtenerVentasPorDia($pdo, $desde, $hasta));
        break;

    case $ruta === 'ingresos_por_rubro' && $metodo === 'GET':
        autorizar(['admin','vendedor']);
        $desde = $_GET['desde'] ?? null;
        $hasta = $_GET['hasta'] ?? null;
        echo json_encode(obtenerIngresosPorRubro($pdo, $desde, $hasta));
        break;

    case $ruta === 'stock_bajo_minimo' && $metodo === 'GET':
        autorizar(['admin','vendedor']);
        echo json_encode(obtenerStockBajoMinimo($pdo));
        break;

    default:
        echo json_encode(["error" => "Ruta no válida en estadisticas"]);
        break;
}
