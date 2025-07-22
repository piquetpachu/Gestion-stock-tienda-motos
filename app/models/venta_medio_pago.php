<?php

function obtenerMediosPagoVenta($pdo, $idVenta)
{
    $stmt = $pdo->prepare("SELECT vmp.*, mp.descripcion AS medio 
                           FROM venta_medio_pago vmp
                           JOIN medio_pago mp ON vmp.id_medio_pago = mp.id_medio_pago
                           WHERE vmp.id_venta = ?");
    $stmt->execute([$idVenta]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function agregarMedioPago($pdo, $idVenta, $datos)
{
    $stmt = $pdo->prepare("INSERT INTO venta_medio_pago (
        id_venta, 
        id_medio_pago, 
        monto, 
        cuil_cuit,
        fecha
    ) VALUES (?, ?, ?, ?, CURRENT_DATE)");

    $stmt->execute([
        $idVenta,
        $datos['id_medio_pago'],
        $datos['monto'],
        $datos['cuil_cuit'] ?? null
    ]);

    return $pdo->lastInsertId();
}

function borrarMedioPago($pdo, $idMedioPago)
{
    $stmt = $pdo->prepare("DELETE FROM venta_medio_pago WHERE id_venta_medio_pago = ?");
    $stmt->execute([$idMedioPago]);
    return $stmt->rowCount() > 0;
}
