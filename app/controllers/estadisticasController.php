<?php
require_once __DIR__ . '/../models/estadisticas.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../helpers/parsearRutas.php';
require_once __DIR__ . '/../helpers/middlewares.php';

switch (true) {
    case $ruta === 'estadisticas' && $metodo === 'GET':
        autorizar(['admin']);
        echo json_encode(obtenerResumenEstadisticas($pdo));
        break;

    case $ruta === 'top_productos' && $metodo === 'GET':
        autorizar(['admin']);
        echo json_encode(obtenerTopProductos($pdo));
        break;

    default:
        echo json_encode(["error" => "Ruta no válida en estadisticas"]);
        break;
}
