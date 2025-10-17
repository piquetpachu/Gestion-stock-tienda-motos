<?php
require_once __DIR__ . '/../models/proveedores.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../helpers/parsearRutas.php';
require_once __DIR__ . '/../helpers/middlewares.php';

header('Content-Type: application/json');

try {
    switch (true) {
        // 📦 Proveedores
        case ($ruta === 'proveedores' && $metodo === 'GET'):
            echo json_encode(obtenerProveedores($pdo));
            break;

        case (preg_match('/^proveedor\/(\d+)$/', $ruta, $matches) ? true : false) && ($metodo === 'GET'):
            echo json_encode(obtenerProveedorPorId($pdo, $matches[1]));
            break;

        case ($ruta === 'crear_proveedor' && $metodo === 'POST'):
            autorizar(['admin']);
            $datos = json_decode(file_get_contents("php://input"), true);
            echo json_encode(['id' => crearProveedor($pdo, $datos)]);
            break;

        case (preg_match('/^actualizar_proveedor\/(\d+)$/', $ruta, $matches) ? true : false) && ($metodo === 'PUT'):
            autorizar(['admin']);
            $datos = json_decode(file_get_contents("php://input"), true);
            echo json_encode(['actualizado' => actualizarProveedor($pdo, $matches[1], $datos)]);
            break;

        case (preg_match('/^borrar_proveedor\/(\d+)$/', $ruta, $matches) ? true : false) && ($metodo === 'DELETE'):
            autorizar(['admin']);
            echo json_encode(['borrado' => borrarProveedor($pdo, $matches[1])]);
            break;

        default:
            http_response_code(404);
            echo json_encode(["error" => "Endpoint no encontrado"]);
            break;
    }
} catch (PDOException $e) {
    // Violación de clave foránea u otro error SQL
    if ($e->getCode() === '23000') {
        http_response_code(409); // conflicto
        echo json_encode(["error" => "No se puede borrar el proveedor: tiene datos asociados (por ejemplo, productos)." ]);
    } else {
        http_response_code(400);
        echo json_encode(["error" => $e->getMessage()]);
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["error" => $e->getMessage()]);
}