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
        if (empty($desde)) $desde = date('Y-m-d');
        if (empty($hasta)) $hasta = date('Y-m-d');

        // Incluir todo el día
        $desde .= ' 00:00:00';
        $hasta .= ' 23:59:59';

        // Consultar usando las tablas reales
        $sql = "SELECT v.id_venta AS id, v.fecha, v.monto_total AS total, 
                       mp.monto, mp.medio_pago
                FROM venta v
                LEFT JOIN venta_medio_pago mp ON v.id_venta = mp.venta_id
                WHERE v.fecha BETWEEN :desde AND :hasta
                ORDER BY v.fecha DESC";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([':desde' => $desde, ':hasta' => $hasta]);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

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
                if (isset($resumen[$medio])) $resumen[$medio] += $row['monto'];
            }
        }

        return ['ventas' => array_values($ventas), 'resumen' => $resumen];
    }
}
