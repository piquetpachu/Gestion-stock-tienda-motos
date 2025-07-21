<?php

require_once 'venta_medio_pago.php'; // Asegúrate de incluir esto para poder usar agregarMedioPago()

function obtenerVentas($pdo)
{
    $stmt = $pdo->query("SELECT * FROM venta ORDER BY fecha DESC");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function obtenerVentaPorId($pdo, $id)
{
    $stmt = $pdo->prepare("SELECT * FROM venta WHERE id_venta = ?");
    $stmt->execute([$id]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function obtenerDetalleVenta($pdo, $id)
{
    $sql = "SELECT v.*, vi.id_producto, p.nombre, vi.cantidad, vi.precio_unitario
            FROM venta v
            JOIN venta_item vi ON v.id_venta = vi.id_venta
            JOIN producto p ON p.id_producto = vi.id_producto
            WHERE v.id_venta = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$id]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function obtenerProductos($pdo)
{
    $stmt = $pdo->query("SELECT id_producto, nombre, precio_venta FROM producto ORDER BY nombre ASC");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function crearVenta($pdo, $datos)
{
    $pdo->beginTransaction();

    try {
        // Insertar en tabla venta
        $stmt = $pdo->prepare("INSERT INTO venta (fecha, monto_total, tipo_comprobante, nro_comprobante, id_iva, id_usuario) 
                               VALUES (NOW(), ?, ?, ?, ?, ?)");
        $stmt->execute([
            $datos['monto_total'],
            $datos['tipo_comprobante'],
            $datos['nro_comprobante'],
            $datos['id_iva'],
            $datos['id_usuario']
        ]);

        $idVenta = $pdo->lastInsertId();

        // Insertar productos vendidos
        foreach ($datos['items'] as $item) {
            $stmtItem = $pdo->prepare("INSERT INTO venta_item (id_venta, id_producto, cantidad, precio_unitario, descuento, iva) 
                                       VALUES (?, ?, ?, ?, ?, ?)");
            $stmtItem->execute([
                $idVenta,
                $item['id_producto'],
                $item['cantidad'],
                $item['precio_unitario'],
                $item['descuento'] ?? 0,
                $item['iva'] ?? 0
            ]);

            // Actualizar stock
            $stmtStock = $pdo->prepare("UPDATE producto SET stock = stock - ? WHERE id_producto = ?");
            $stmtStock->execute([
                $item['cantidad'],
                $item['id_producto']
            ]);
        }

        // Insertar medios de pago (con campos adicionales)
        foreach ($datos['pagos'] as $pago) {
            agregarMedioPago($pdo, $idVenta, [
                'id_medio_pago' => $pago['id_medio_pago'],
                'monto' => $pago['monto'],
                'nombre_titular' => $pago['nombre_titular'] ?? null,
                'numero_tarjeta' => $pago['numero_tarjeta'] ?? null,
                'fecha_vencimiento' => $pago['fecha_vencimiento'] ?? null,
                'dni' => $pago['dni'] ?? null,
                'id_cuenta_corriente' => $pago['id_cuenta_corriente'] ?? null
            ]);
        }

        $pdo->commit();
        return ["success" => true, "id_venta" => $idVenta];
    } catch (Exception $e) {
        $pdo->rollBack();
        return ["error" => "Error al crear la venta", "detalle" => $e->getMessage()];
    }
}

function borrarVenta($pdo, $id)
{
    $stmt = $pdo->prepare("DELETE FROM venta WHERE id_venta = ?");
    $stmt->execute([$id]);
    return $stmt->rowCount() > 0;
}
