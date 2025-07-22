<?php
require_once __DIR__ . '/../models/compras.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../helpers/parsearRutas.php';
require_once __DIR__ . '/../helpers/middlewares.php';

switch (true) {
    case $ruta === 'compras' && $metodo === 'GET':
        autorizar(['admin', 'vendedor']);
        echo json_encode(obtenerCompras($pdo));
        break;

    case preg_match('/^compra\/(\d+)$/', $ruta, $matches) && $metodo === 'GET':
        autorizar(['admin', 'vendedor']);
        echo json_encode(obtenerCompraPorId($pdo, $matches[1]));
        break;

    case $ruta === 'crear_compra' && $metodo === 'POST':
        autorizar(['admin']);
        $datos = json_decode(file_get_contents('php://input'), true);
        echo json_encode(crearCompra($pdo, $datos));
        break;

    case preg_match('/^borrar_compra\/(\d+)$/', $ruta, $matches) && $metodo === 'DELETE':
        autorizar(['admin']);
        echo json_encode(borrarCompra($pdo, $matches[1]));
        break;

    default:
        echo json_encode(["error" => "Ruta no válida en compra"]);
        break;
}
