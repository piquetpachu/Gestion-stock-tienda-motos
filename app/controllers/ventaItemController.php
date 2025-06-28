<?php
require_once __DIR__ . '/../models/venta_item.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../helpers/parsearRutas.php';

switch (true) {
    case preg_match('/^items_venta\/(\d+)$/', $ruta, $matches) && $metodo === 'GET':
        echo json_encode(obtenerItemsDeVenta($pdo, $matches[1]));
        break;

    case preg_match('/^agregar_item\/(\d+)$/', $ruta, $matches) && $metodo === 'POST':
        $idVenta = $matches[1];
        $datos = json_decode(file_get_contents('php://input'), true);
        echo json_encode(agregarItemAVenta($pdo, $idVenta, $datos));
        break;

    case preg_match('/^actualizar_item\/(\d+)$/', $ruta, $matches) && $metodo === 'PUT':
        $idItem = $matches[1];
        $datos = json_decode(file_get_contents('php://input'), true);
        echo json_encode(actualizarItemVenta($pdo, $idItem, $datos));
        break;

    case preg_match('/^borrar_item\/(\d+)$/', $ruta, $matches) && $metodo === 'DELETE':
        echo json_encode(borrarItemVenta($pdo, $matches[1]));
        break;

    default:
        echo json_encode(["error" => "Ruta no válida en venta_item"]);
        break;
}
