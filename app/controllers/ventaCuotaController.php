<?php
require_once __DIR__ . '/../models/venta_cuota.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../helpers/parsearRutas.php';
require_once __DIR__ . '/../helpers/middlewares.php';

switch (true) {
    case preg_match('/^cuotas\/(\d+)$/', $ruta, $matches) && $metodo === 'GET':
        autorizar(['admin', 'vendedor']);
        echo json_encode(obtenerCuotasDeVenta($pdo, $matches[1]));
        break;

    case preg_match('/^detalle_cuotas\/(\d+)$/', $ruta, $matches) && $metodo === 'GET':
        autorizar(['admin', 'vendedor']);
        echo json_encode(obtenerDetalleCuotasPendientes($pdo, $matches[1]));
        break;

    case preg_match('/^crear_cuota\/(\d+)$/', $ruta, $matches) && $metodo === 'POST':
        autorizar(['admin']);
        $datos = json_decode(file_get_contents('php://input'), true);
        echo json_encode(registrarCuota($pdo, $matches[1], $datos));
        break;

    case preg_match('/^actualizar_cuota\/(\d+)$/', $ruta, $matches) && $metodo === 'PUT':
        autorizar(['admin']);
        $datos = json_decode(file_get_contents('php://input'), true);
        echo json_encode(actualizarCuota($pdo, $matches[1], $datos));
        break;

    case preg_match('/^borrar_cuota\/(\d+)$/', $ruta, $matches) && $metodo === 'DELETE':
        autorizar(['admin']);
        echo json_encode(borrarCuota($pdo, $matches[1]));
        break;

    case 'crear_cuotas':
    error_log("🟡 [DEBUG] Entrando al case crear_cuotas"); // Log básico
    $data = json_decode(file_get_contents("php://input"), true);

    // Si se está llamando desde include, puede que $_POST tenga los datos
    if (!$data && isset($_POST['id_venta'])) {
        $data = $_POST;
    }

    error_log("🟡 [DEBUG] Datos recibidos en crear_cuotas: " . print_r($data, true));

    if (!isset($data['id_venta'], $data['monto_total'], $data['cuotas'])) {
        error_log("🔴 [ERROR] Faltan datos para generar las cuotas");
        echo json_encode(['error' => 'Faltan datos para generar las cuotas']);
        exit;
    }

    $ok = crearCuotas($pdo, $data['id_venta'], $data['monto_total'], $data['cuotas']);

    if ($ok) {
        error_log("🟢 [OK] Cuotas generadas correctamente para venta ID {$data['id_venta']}");
        echo json_encode(['message' => 'Cuotas generadas correctamente']);
    } else {
        error_log("🔴 [ERROR] Falló la generación de cuotas para venta ID {$data['id_venta']}");
        echo json_encode(['error' => 'No se generaron las cuotas']);
    }
    break;

    default:
        echo json_encode(["error" => "Ruta no válida en venta_cuota"]);
        break;
}
