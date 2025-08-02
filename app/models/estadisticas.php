<?php
function obtenerResumenEstadisticas($pdo) {
    $hoy = date('Y-m-d');
    $inicioMes = date('Y-m-01');
    $inicioAnio = date('Y-01-01');

    $resumen = [];

    // Total ganado hoy
    $stmt = $pdo->prepare("SELECT SUM(monto_total) AS total FROM venta WHERE fecha = ?");
    $stmt->execute([$hoy]);
    $resumen['ganancia_hoy'] = (float) $stmt->fetchColumn() ?: 0;

    // Total ganado en el mes
    $stmt = $pdo->prepare("SELECT SUM(monto_total) AS total FROM venta WHERE fecha >= ?");
    $stmt->execute([$inicioMes]);
    $resumen['ganancia_mes'] = (float) $stmt->fetchColumn() ?: 0;

    // Total ganado en el año
    $stmt = $pdo->prepare("SELECT SUM(monto_total) AS total FROM venta WHERE fecha >= ?");
    $stmt->execute([$inicioAnio]);
    $resumen['ganancia_anio'] = (float) $stmt->fetchColumn() ?: 0;

    // Producto más vendido
    $stmt = $pdo->query("
        SELECT p.nombre, SUM(vi.cantidad) AS total_vendidos
        FROM venta_item vi
        JOIN producto p ON p.id_producto = vi.id_producto
        GROUP BY vi.id_producto
        ORDER BY total_vendidos DESC
        LIMIT 1
    ");
    $fila = $stmt->fetch();
    $resumen['producto_mas_vendido'] = $fila['nombre'] ?? 'Sin datos';

    return $resumen;
}

function obtenerTopProductos($pdo, $limite = 10) {
    $stmt = $pdo->prepare("
        SELECT p.nombre, SUM(vi.cantidad) AS cantidad
        FROM venta_item vi
        JOIN producto p ON p.id_producto = vi.id_producto
        GROUP BY vi.id_producto
        ORDER BY cantidad DESC
        LIMIT ?
    ");
    $stmt->bindValue(1, $limite, PDO::PARAM_INT);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
