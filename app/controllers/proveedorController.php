<?php
require_once __DIR__ . '/../models/proveedores.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../helpers/parsearRutas.php';
require_once __DIR__ . '/../helpers/middlewares.php';
switch (true) {
    // 📦 Proveedores
    case ($ruta === 'proveedores' && $metodo === 'GET'):
        echo json_encode(obtenerProveedores($pdo));
        break;

    case (preg_match('/^proveedor\/(\d+)$/', $ruta, $matches) ? true : false) && ($metodo === 'GET'):
        echo json_encode(obtenerProveedorPorId($pdo, $matches[1]));
        break;

    case ($ruta === 'crear_proveedor' && $metodo === 'POST'):
        $datos = json_decode(file_get_contents("php://input"), true);
        echo json_encode(['id' => crearProveedor($pdo, $datos)]);
        break;

    case (preg_match('/^actualizar_proveedor\/(\d+)$/', $ruta, $matches) ? true : false) && ($metodo === 'PUT'):
        $datos = json_decode(file_get_contents("php://input"), true);
        echo json_encode(['actualizado' => actualizarProveedor($pdo, $matches[1], $datos)]);
        break;

    case (preg_match('/^borrar_proveedor\/(\d+)$/', $ruta, $matches) ? true : false) && ($metodo === 'DELETE'):
        echo json_encode(['borrado' => borrarProveedor($pdo, $matches[1])]);
        break;
}