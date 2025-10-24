<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../models/ventas.php';
require_once __DIR__ . '/../helpers/parsearRutas.php';
require_once __DIR__ . '/../helpers/middlewares.php';

switch (true) {
    case $ruta === 'ventas' && $metodo === 'GET':
        autorizar(['admin', 'vendedor']);
        echo json_encode(obtenerVentas($pdo));
        break;

    case preg_match('/^venta\/(\d+)$/', $ruta, $matches) && $metodo === 'GET':
        autorizar(['admin', 'vendedor']);
        echo json_encode(obtenerVentaPorId($pdo, $matches[1]));
        break;

    case preg_match('/^detalle_venta\/(\d+)$/', $ruta, $matches) && $metodo === 'GET':
        autorizar(['admin', 'vendedor']);
        echo json_encode(obtenerDetalleVenta($pdo, $matches[1]));
        break;

    case $ruta === 'crear_venta' && $metodo === 'POST':
    autorizar(['admin', 'vendedor']);
    $datos = json_decode(file_get_contents('php://input'), true);

    // Crear la venta normalmente
    $resultado = crearVenta($pdo, $datos);

    // Si la venta se creó correctamente y devuelve un ID
    if (isset($resultado['id_venta']) && isset($datos['cuotas']) && $datos['cuotas'] > 1) {
        require_once __DIR__ . '/ventaCuotaController.php';
        $accion = 'crear_cuotas';
        $_POST = [
            'id_venta' => $resultado['id_venta'],
            'monto_total' => $datos['monto_total'],
            'cuotas' => $datos['cuotas']
        ];
        include __DIR__ . '/ventaCuotaController.php';
    }

    echo json_encode($resultado);
    break;


    case preg_match('/^borrar_venta\/(\d+)$/', $ruta, $matches) && $metodo === 'DELETE':
        autorizar(['admin', 'vendedor']);
        echo json_encode(borrarVenta($pdo, $matches[1]));
        break;

    default:
        echo json_encode(["error" => "Ruta no válida en ventas"]);
        break;
}
