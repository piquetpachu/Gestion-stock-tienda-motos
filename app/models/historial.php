<?php

function obtenerHistorialPorFechas($pdo, $desde, $hasta)
{
    // Si no se seleccionan fechas, usar el día actual
    if (empty($desde)) $desde = date('Y-m-d');
    if (empty($hasta)) $hasta = date('Y-m-d');

    // Agregar horas para incluir todo el rango de días
    $desde .= ' 00:00:00';
    $hasta .= ' 23:59:59';

    // ✅ Consulta corregida según tu estructura real
    $sql = "SELECT 
                v.id_venta AS id, 
                v.fecha, 
                v.monto_total AS total, 
                mp.monto, 
                mp.cuil_cuit,
                mp.fecha AS fecha_pago,
                m.descripcion AS medio_pago
            FROM venta v
            LEFT JOIN venta_medio_pago mp ON v.id_venta = mp.id_venta
            LEFT JOIN medio_pago m ON mp.id_medio_pago = m.id_medio_pago
            WHERE v.fecha BETWEEN :desde AND :hasta
            ORDER BY v.fecha DESC";

    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':desde' => $desde, ':hasta' => $hasta]);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Estructuras para los resultados
        $ventas = [];
        $resumen = [
            'efectivo' => 0,
            'transferencia bancaria' => 0,
            'mercado pago' => 0,
            'tarjeta de crédito' => 0,
            'tarjeta de débito' => 0,
            'cuenta corriente' => 0
        ];

        // Procesar los resultados
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
                    'monto' => $row['monto'],
                    'cuil_cuit' => $row['cuil_cuit'],
                    'fecha_pago' => $row['fecha_pago']
                ];

                // Sumar al resumen
                $medio = strtolower(trim($row['medio_pago']));
                if (isset($resumen[$medio])) {
                    $resumen[$medio] += $row['monto'];
                }
            }
        }

        return [
            'success' => true,
            'ventas' => array_values($ventas),
            'resumen' => $resumen
        ];
    } catch (PDOException $e) {
        return [
            'success' => false,
            'error' => 'Error al obtener el historial',
            'detalle' => $e->getMessage()
        ];
    }
}
