<?php

function obtenerCuotasDeVenta($pdo, $idVenta) {
    $stmt = $pdo->prepare("SELECT * FROM venta_cuota WHERE id_venta = ?");
    $stmt->execute([$idVenta]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function registrarCuota($pdo, $idVenta, $datos) {
    $stmt = $pdo->prepare("INSERT INTO venta_cuota 
        (id_venta, valor, fecha_venc, valor_venc, fecha_pago, valor_pago)
        VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $idVenta,
        $datos['valor'],
        $datos['fecha_venc'],
        $datos['valor_venc'] ?? null,
        $datos['fecha_pago'] ?? null,
        $datos['valor_pago'] ?? null
    ]);
    return $pdo->lastInsertId();
}

function actualizarCuota($pdo, $idCuota, $datos) {
    $stmt = $pdo->prepare("UPDATE venta_cuota SET 
        valor = ?, fecha_venc = ?, valor_venc = ?, fecha_pago = ?, valor_pago = ?
        WHERE id_cuota = ?");
    $stmt->execute([
        $datos['valor'],
        $datos['fecha_venc'],
        $datos['valor_venc'],
        $datos['fecha_pago'],
        $datos['valor_pago'],
        $idCuota
    ]);
    return $stmt->rowCount() > 0;
}

function borrarCuota($pdo, $idCuota) {
    $stmt = $pdo->prepare("DELETE FROM venta_cuota WHERE id_cuota = ?");
    $stmt->execute([$idCuota]);
    return $stmt->rowCount() > 0;
}

function crearCuotas($pdo, $id_venta, $monto_total, $cantidad_cuotas)
{
    error_log("🟡 [DEBUG] Ejecutando crearCuotas() con id_venta=$id_venta, monto_total=$monto_total, cuotas=$cantidad_cuotas");

    if ($cantidad_cuotas <= 1) {
        error_log("⚪ [INFO] No se crean cuotas porque la cantidad es menor o igual a 1");
        return false;
    }

    $valor_cuota = round($monto_total / $cantidad_cuotas, 2);
    $fecha_actual = new DateTime();

    $sql = "INSERT INTO venta_cuota (id_venta, valor, fecha_venc, valor_venc) VALUES (?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);

    for ($i = 1; $i <= $cantidad_cuotas; $i++) {
        $fecha_venc = (clone $fecha_actual)->modify("+$i month");
        try {
            $stmt->execute([
                $id_venta,
                $valor_cuota,
                $fecha_venc->format('Y-m-d'),
                $valor_cuota
            ]);
            error_log("🟢 [OK] Cuota $i insertada con vencimiento {$fecha_venc->format('Y-m-d')}");
        } catch (PDOException $e) {
            error_log("🔴 [ERROR] Falló la inserción de la cuota $i: " . $e->getMessage());
            return false;
        }
    }

    return true;
}
