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
        nombre_titular, 
        numero_tarjeta, 
        fecha_vencimiento, 
        dni, 
        id_cuenta_corriente
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

    $stmt->execute([
        $idVenta,
        $datos['id_medio_pago'],
        $datos['monto'],
        $datos['nombre_titular'] ?? null,
        $datos['numero_tarjeta'] ?? null,
        $datos['fecha_vencimiento'] ?? null,
        $datos['dni'] ?? null,
        $datos['id_cuenta_corriente'] ?? null
    ]);

    return $pdo->lastInsertId();
}

function borrarMedioPago($pdo, $idMedioPago)
{
    $stmt = $pdo->prepare("DELETE FROM venta_medio_pago WHERE id_venta_medio_pago = ?");
    $stmt->execute([$idMedioPago]);
    return $stmt->rowCount() > 0;
}
