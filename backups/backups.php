<?php
require_once '../config/cargar_env.php';
cargarEnv(__DIR__ . '/../.env');

$host = getenv('DB_HOST');
$db = getenv('DB_NAME');
$user = getenv('DB_USER');
$pass = getenv('DB_PASS');
$charset = getenv('DB_CHARSET');

$mysqldumpPath = 'C:\\xampp\\mysql\\bin\\mysqldump.exe';
$backupDir = __DIR__ . '/';
$backupFile = $backupDir . $db . '_' . date('Y-m-d_H-i-s') . '.sql';

// Asegúrate de que el directorio existe
if (!is_dir($backupDir)) {
    mkdir($backupDir, 0777, true);
}

// Comando para Windows
$command = "\"$mysqldumpPath\" --user=\"$user\" --password=\"$pass\" --host=\"$host\" \"$db\" > \"$backupFile\"";
$output = null;
$return_var = null;
system($command, $return_var);

if ($return_var === 0) {
    echo "Backup generado: $backupFile";
} else {
    echo "Error al generar backup. Código de salida: $return_var";
}
?>