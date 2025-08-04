<?php

function autenticar() {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    
    if (!isset($_SESSION['usuario'])) {
        http_response_code(401);
        echo json_encode(["error" => "No autenticado"]);
        exit;
    }
}

function autorizar($rolesPermitidos = []) {
    autenticar();
    
    if (!empty($rolesPermitidos)) {
        $rolUsuario = $_SESSION['usuario']['rol'];
        
        if (!in_array($rolUsuario, $rolesPermitidos)) {
            http_response_code(403);
            echo json_encode(["error" => "No autorizado"]);
            exit;
        }
    }
    
    return $_SESSION['usuario'];
}