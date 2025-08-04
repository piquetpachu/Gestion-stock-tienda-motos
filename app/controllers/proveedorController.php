<?php
require_once __DIR__ . '/../models/proveedores.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../helpers/parsearRutas.php';
require_once __DIR__ . '/../helpers/middlewares.php';
switch (true) {
    case $ruta === 'proveedores' && $metodo === 'GET':
        autorizar(['admin', 'vendedor']);
        echo json_encode(obtenerproveedor($pdo));
        break;
    
    default:
        echo json_encode(["error" => "Ruta no válida en rubro"]);
        break;
    }