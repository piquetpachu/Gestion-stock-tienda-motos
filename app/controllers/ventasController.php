<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../models/ventas.php';
require_once __DIR__ . '/../helpers/parsearRutas.php';


switch (true) {
    case $ruta === 'ventas' && $metodo === 'GET':
        echo json_encode(obtenerVentas($pdo));
        break;

    case preg_match('/^venta\/(\d+)$/', $ruta, $matches) && $metodo === 'GET':
        echo json_encode(obtenerVentaPorId($pdo, $matches[1]));
        break;

    case preg_match('/^detalle_venta\/(\d+)$/', $ruta, $matches) && $metodo === 'GET':
        echo json_encode(obtenerDetalleVenta($pdo, $matches[1]));
        break;

    case $ruta === 'crear_venta' && $metodo === 'POST':
        $datos = json_decode(file_get_contents('php://input'), true);
        echo json_encode(crearVenta($pdo, $datos));
        break;

    case preg_match('/^borrar_venta\/(\d+)$/', $ruta, $matches) && $metodo === 'DELETE':
        echo json_encode(borrarVenta($pdo, $matches[1]));
        break;

    default:
        echo json_encode(["error" => "Ruta no válida en ventas"]);
        break;
}
