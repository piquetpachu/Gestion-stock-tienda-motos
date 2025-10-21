<?php

require_once __DIR__ . '/../models/historial.php';  // Importa el modelo

function obtenerHistorialController($pdo)
{
    // Obtener parámetros GET si existen
    $desde = isset($_GET['desde']) ? $_GET['desde'] : null;
    $hasta = isset($_GET['hasta']) ? $_GET['hasta'] : null;

    try {
        $resultado = obtenerHistorialPorFechas($pdo, $desde, $hasta);

        // Respuesta JSON
        header('Content-Type: application/json');
        echo json_encode([
            'success' => true,
            'data' => $resultado
        ]);
    } catch (Exception $e) {
        // Manejo de errores
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Error al obtener el historial',
            'detalle' => $e->getMessage()
        ]);
    }
}
