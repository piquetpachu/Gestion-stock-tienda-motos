<?php
require_once __DIR__ . '/../models/iva.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../helpers/parsearRutas.php';



switch (true) {
    case $ruta === 'ivas' && $metodo === 'GET':
        echo json_encode(obtenerIvas($pdo));
        break;

    case preg_match('/^iva\/(\d+)$/', $ruta, $matches) && $metodo === 'GET':
        echo json_encode(obtenerIvaPorId($pdo, $matches[1]));
        break;

    case $ruta === 'crear_iva' && $metodo === 'POST':
        $datos = json_decode(file_get_contents('php://input'), true);
        echo json_encode(["id" => crearIva($pdo, $datos)]);
        break;

    case preg_match('/^actualizar_iva\/(\d+)$/', $ruta, $matches) && $metodo === 'PUT':
        $datos = json_decode(file_get_contents('php://input'), true);
        echo json_encode(actualizarIva($pdo, $matches[1], $datos));
        break;

    case preg_match('/^borrar_iva\/(\d+)$/', $ruta, $matches) && $metodo === 'DELETE':
        echo json_encode(borrarIva($pdo, $matches[1]));
        break;

    default:
        echo json_encode(["error" => "Ruta no válida en iva"]);
        break;
}
