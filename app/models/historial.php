<?php

/**
 * -----------------------------------------------------------
 * MODELO: HISTORIAL DE VENTAS
 * -----------------------------------------------------------
 * Contiene las funciones para consultar el historial de ventas
 * filtrado por rango de fechas y generar un resumen por medio de pago.
 * -----------------------------------------------------------
 */

require_once 'venta_medio_pago.php'; // Por coherencia estructural
require_once 'venta_item.php'; // Para traer los productos vendidos


/**
 * Obtener el historial de ventas entre dos fechas
 *
 * @param PDO $pdo Conexión a la base de datos
 * @param string|null $desde Fecha de inicio (Y-m-d)
 * @param string|null $hasta Fecha de fin (Y-m-d)
 * @return array Resultado con listado de ventas y resumen
 */
function obtenerHistorialPorFechas($pdo, $desde = null, $hasta = null)
{
    // Si no se seleccionan fechas, se usa el día actual
    if (empty($desde)) $desde = date('Y-m-d');
    if (empty($hasta)) $hasta = date('Y-m-d');

    // Se agregan las horas para cubrir todo el día
    $desde .= ' 00:00:00';
    $hasta .= ' 23:59:59';

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

        // Procesar las filas obtenidas
        foreach ($result as $row) {
            $id = $row['id'];

            // Crear entrada base de la venta si no existe aún
            if (!isset($ventas[$id])) {
                $ventas[$id] = [
                    'id' => $id,
                    'fecha' => $row['fecha'],
                    'total' => $row['total'],
                    'pagos' => []
                ];
            }

            // Agregar información de medios de pago
            if (!empty($row['medio_pago'])) {
                $ventas[$id]['pagos'][] = [
                    'medio_pago' => $row['medio_pago'],
                    'monto' => $row['monto'],
                    'cuil_cuit' => $row['cuil_cuit'],
                    'fecha_pago' => $row['fecha_pago']
                ];

                // Normalizar y sumar al resumen
                $medio = strtolower(trim($row['medio_pago']));
                if (isset($resumen[$medio])) {
                    $resumen[$medio] += floatval($row['monto']);
                }
            }
        }


        // 🔹 Agregar productos por venta
        foreach ($ventas as $id => &$venta) {
            $sqlItems = "SELECT 
                    p.nombre AS producto,
                    vi.cantidad,
                    vi.precio_unitario
                 FROM venta_item vi
                 JOIN producto p ON vi.id_producto = p.id_producto
                 WHERE vi.id_venta = :id";
            $stmtItems = $pdo->prepare($sqlItems);
            $stmtItems->execute([':id' => $id]);
            $venta['items'] = $stmtItems->fetchAll(PDO::FETCH_ASSOC);
        }
        unset($venta); // buena práctica

        // Retornar estructura final coherente con otros modelos
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
