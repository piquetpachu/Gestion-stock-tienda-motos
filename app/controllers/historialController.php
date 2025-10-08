<?php
require_once __DIR__ . '/../models/historial.php';

class HistorialController
{
    private $pdo;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }

    public function obtenerHistorial()
    {
        header('Content-Type: application/json');
        $desde = $_GET['desde'] ?? '';
        $hasta = $_GET['hasta'] ?? '';

        $modelo = new Historial($this->pdo);
        $data = $modelo->obtenerPorFechas($desde, $hasta);

        echo json_encode($data);
    }
}
