<?php
header("Content-Type: application/json");
// Para entorno local, permitir mismo origen; si sirves todo desde el mismo host no debería requerir CORS amplio
header("Access-Control-Allow-Origin: http://localhost");
header("Vary: Origin");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
	http_response_code(204);
	exit;
}

require_once 'routes/api.php';

