<?php
require_once __DIR__ . '/../models/clientes.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../helpers/parsearRutas.php';


switch (true) {
    case $ruta === 'clientes' && $metodo === 'GET':
        echo json_encode(obtenerClientes($pdo));
        break;

    case preg_match('/^cliente\/(\d+)$/', $ruta, $matches) && $metodo === 'GET':
        echo json_encode(obtenerClientePorId($pdo, $matches[1]));
        break;

    case $ruta === 'crear_cliente' && $metodo === 'POST':
        $datos = json_decode(file_get_contents('php://input'), true);
        echo json_encode(["id" => crearCliente($pdo, $datos)]);
        break;

    case preg_match('/^actualizar_cliente\/(\d+)$/', $ruta, $matches) && $metodo === 'PUT':
        $datos = json_decode(file_get_contents('php://input'), true);
        echo json_encode(actualizarCliente($pdo, $matches[1], $datos));
        break;

    case preg_match('/^borrar_cliente\/(\d+)$/', $ruta, $matches) && $metodo === 'DELETE':
        echo json_encode(borrarCliente($pdo, $matches[1]));
        break;

    default:
        echo json_encode(["error" => "Ruta no válida en cliente"]);
        break;
}
