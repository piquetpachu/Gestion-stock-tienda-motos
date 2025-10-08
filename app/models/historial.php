<?php
class Historial
{
    private $db;

    public function __construct($pdo)
    {
        $this->db = $pdo;
    }

    public function obtenerPorFechas($desde, $hasta)
    {
        // Si no se selecciona ninguna fecha, usar el día actual
        if (empty($desde)) {
            $desde = date('Y-m-d');
        }
        if (empty($hasta)) {
            $hasta = date('Y-m-d');
        }

        // Asegurarse de incluir todo el día
        $desde .= ' 00:00:00';
        $hasta .= ' 23:59:59';

        $sql = "SELECT v.id, v.fecha, v.total, p.medio_pago, p.monto
                FROM ventas v
                LEFT JOIN pagos p ON v.id = p.venta_id
                WHERE v.fecha BETWEEN :desde AND :hasta
                ORDER BY v.fecha DESC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':desde' => $desde, ':hasta' => $hasta]);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Agrupar por venta
        $ventas = [];
        $resumen = [
            'efectivo' => 0,
            'transferencia bancaria' => 0,
            'mercado pago' => 0,
            'tarjeta de crédito' => 0,
            'tarjeta de débito' => 0,
            'cuenta corriente' => 0
        ];

        foreach ($result as $row) {
            $id = $row['id'];
            if (!isset($ventas[$id])) {
                $ventas[$id] = [
                    'id' => $id,
                    'fecha' => $row['fecha'],
                    'total' => $row['total'],
                    'pagos' => []
                ];
            }
            if ($row['medio_pago']) {
                $ventas[$id]['pagos'][] = [
                    'medio_pago' => $row['medio_pago'],
                    'monto' => $row['monto']
                ];

                $medio = strtolower(trim($row['medio_pago']));
                if (isset($resumen[$medio])) {
                    $resumen[$medio] += $row['monto'];
                }
            }
        }

        return ['ventas' => array_values($ventas), 'resumen' => $resumen];
    }
} 
