<?php
require_once __DIR__ . '/../models/compra_item.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../helpers/parsearRutas.php';



switch (true) {
    case preg_match('/^items_compra\/(\d+)$/', $ruta, $matches) && $metodo === 'GET':
        echo json_encode(obtenerItemsCompra($pdo, $matches[1]));
        break;

    case preg_match('/^borrar_item_compra\/(\d+)$/', $ruta, $matches) && $metodo === 'DELETE':
        echo json_encode(borrarItemCompra($pdo, $matches[1]));
        break;

    default:
        echo json_encode(["error" => "Ruta no válida en compra_item"]);
        break;
}
