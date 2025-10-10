<?php
function obtenerResumenEstadisticas($pdo) {
    $hoy = date('Y-m-d');
    $inicioMes = date('Y-m-01');
    $inicioAnio = date('Y-01-01');

    $resumen = [];

    // Total ganado hoy
    $stmt = $pdo->prepare("SELECT SUM(monto_total) AS ganancias_brutas_hoy
FROM venta
WHERE DATE(fecha) = ?;");
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

function obtenerVentasPorDia($pdo, $desde = null, $hasta = null) {
    if (!$desde) $desde = date('Y-m-d', strtotime('-29 days'));
    if (!$hasta) $hasta = date('Y-m-d');

    $sql = "
        SELECT DATE(v.fecha) AS dia, SUM(v.monto_total) AS total
        FROM venta v
        WHERE DATE(v.fecha) BETWEEN ? AND ?
        GROUP BY DATE(v.fecha)
        ORDER BY dia
    ";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$desde, $hasta]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function obtenerIngresosPorRubro($pdo, $desde = null, $hasta = null) {
    if (!$desde) $desde = date('Y-m-d', strtotime('-29 days'));
    if (!$hasta) $hasta = date('Y-m-d');

    $sql = "
        SELECT r.nombre AS rubro, SUM(vi.cantidad * vi.precio_unitario) AS total
        FROM venta_item vi
        JOIN venta v ON v.id_venta = vi.id_venta
        JOIN producto p ON p.id_producto = vi.id_producto
        LEFT JOIN rubro r ON r.id_rubro = p.id_rubro
        WHERE DATE(v.fecha) BETWEEN ? AND ?
        GROUP BY r.id_rubro
        ORDER BY total DESC
    ";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$desde, $hasta]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function obtenerStockBajoMinimo($pdo) {
    $sql = "
        SELECT p.id_producto, p.nombre, p.stock, p.stock_minimo, COALESCE(r.nombre, 'Sin rubro') AS rubro
        FROM producto p
        LEFT JOIN rubro r ON r.id_rubro = p.id_rubro
        WHERE p.stock < p.stock_minimo
        ORDER BY (p.stock_minimo - p.stock) DESC
    ";
    $stmt = $pdo->query($sql);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
