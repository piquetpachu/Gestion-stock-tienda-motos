<?php
function obtenerResumenEstadisticas($pdo) {
    $resumen = [];

    // Ingresos totales (incluyendo IVA, menos descuento por ítem si aplica)
    $sqlHoy = "
        SELECT COALESCE(SUM(
            (vi.cantidad * vi.precio_unitario * (1 + COALESCE(vi.iva,0)/100))
            - COALESCE(vi.descuento,0)
        ),0) AS total
        FROM venta v
        JOIN venta_item vi ON vi.id_venta = v.id_venta
        WHERE DATE(v.fecha) = CURDATE()
    ";
    $resumen['ganancia_hoy'] = (float) $pdo->query($sqlHoy)->fetchColumn();

    $sqlMes = "
        SELECT COALESCE(SUM(
            (vi.cantidad * vi.precio_unitario * (1 + COALESCE(vi.iva,0)/100))
            - COALESCE(vi.descuento,0)
        ),0) AS total
        FROM venta v
        JOIN venta_item vi ON vi.id_venta = v.id_venta
        WHERE DATE(v.fecha) >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
    ";
    $resumen['ganancia_mes'] = (float) $pdo->query($sqlMes)->fetchColumn();

    $sqlAnio = "
        SELECT COALESCE(SUM(
            (vi.cantidad * vi.precio_unitario * (1 + COALESCE(vi.iva,0)/100))
            - COALESCE(vi.descuento,0)
        ),0) AS total
        FROM venta v
        JOIN venta_item vi ON vi.id_venta = v.id_venta
        WHERE DATE(v.fecha) >= DATE_FORMAT(CURDATE(), '%Y-01-01')
    ";
    $resumen['ganancia_anio'] = (float) $pdo->query($sqlAnio)->fetchColumn();

    // Producto más vendido (histórico)
    $stmt = $pdo->query("\n        SELECT p.nombre, SUM(vi.cantidad) AS total_vendidos\n        FROM venta_item vi\n        JOIN producto p ON p.id_producto = vi.id_producto\n        GROUP BY vi.id_producto\n        ORDER BY total_vendidos DESC\n        LIMIT 1\n    ");
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
    // Por defecto: Año en curso (YTD)
    if (!$desde) $desde = date('Y-01-01');
    if (!$hasta) $hasta = date('Y-m-d');

    // Ingresos por día (incluyen IVA, descuentan descuento por ítem si aplica)
    $sql = "
        SELECT DATE(v.fecha) AS dia,
               COALESCE(SUM((vi.cantidad * vi.precio_unitario * (1 + COALESCE(vi.iva,0)/100)) - COALESCE(vi.descuento,0)), 0) AS total
        FROM venta v
        JOIN venta_item vi ON vi.id_venta = v.id_venta
        WHERE DATE(v.fecha) BETWEEN ? AND ?
        GROUP BY DATE(v.fecha)
        ORDER BY dia
    ";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$desde, $hasta]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function obtenerIngresosPorRubro($pdo, $desde = null, $hasta = null) {
    // Por defecto: Año en curso (YTD)
    if (!$desde) $desde = date('Y-01-01');
    if (!$hasta) $hasta = date('Y-m-d');

    $sql = "
        SELECT COALESCE(r.nombre, 'Sin rubro') AS rubro,
               SUM(vi.cantidad * vi.precio_unitario * (1 + COALESCE(vi.iva,0)/100) - COALESCE(vi.descuento,0)) AS total
        FROM venta_item vi
        JOIN venta v ON v.id_venta = vi.id_venta
        JOIN producto p ON p.id_producto = vi.id_producto
        LEFT JOIN rubro r ON r.id_rubro = p.id_rubro
        WHERE DATE(v.fecha) BETWEEN ? AND ?
        GROUP BY p.id_rubro
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
