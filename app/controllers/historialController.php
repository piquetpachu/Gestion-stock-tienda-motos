<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../models/historial.php';
require_once __DIR__ . '/../helpers/middlewares.php';

// Validar que sea GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode(["error" => "Método no permitido"]);
    exit;
}

// Autorización
autorizar(['admin', 'vendedor']);

// Leer parámetros
$desde = $_GET['desde'] ?? null;
$hasta = $_GET['hasta'] ?? null;

// Validar formato de fechas (YYYY-MM-DD)
if ($desde && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $desde)) {
    echo json_encode(['success' => false, 'error' => 'Formato inválido en parámetro "desde".']);
    exit;
}

if ($hasta && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $hasta)) {
    echo json_encode(['success' => false, 'error' => 'Formato inválido en parámetro "hasta".']);
    exit;
}

// Ejecutar consulta
$resultado = obtenerHistorialPorFechas($pdo, $desde, $hasta);
echo json_encode($resultado);
