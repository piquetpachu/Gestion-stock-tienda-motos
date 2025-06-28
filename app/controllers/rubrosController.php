<?php
require_once __DIR__ . '/../models/rubros.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../helpers/parsearRutas.php';

switch (true) {
    case $ruta === 'rubros' && $metodo === 'GET':
        echo json_encode(obtenerRubros($pdo));
        break;

    case preg_match('/^rubro\/(\d+)$/', $ruta, $matches) && $metodo === 'GET':
        echo json_encode(obtenerRubroPorId($pdo, $matches[1]));
        break;

    case $ruta === 'crear_rubro' && $metodo === 'POST':
        $datos = json_decode(file_get_contents('php://input'), true);
        echo json_encode(["id" => crearRubro($pdo, $datos)]);
        break;

    case preg_match('/^actualizar_rubro\/(\d+)$/', $ruta, $matches) && $metodo === 'PUT':
        $datos = json_decode(file_get_contents('php://input'), true);
        echo json_encode(actualizarRubro($pdo, $matches[1], $datos));
        break;

    case preg_match('/^borrar_rubro\/(\d+)$/', $ruta, $matches) && $metodo === 'DELETE':
        echo json_encode(borrarRubro($pdo, $matches[1]));
        break;

    default:
        echo json_encode(["error" => "Ruta no válida en rubro"]);
        break;
}
