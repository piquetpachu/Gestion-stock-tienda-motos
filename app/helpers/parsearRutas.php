<?php
$metodo = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$basePath = '/Gestion-stock-tienda-motos/app/';
$ruta = str_replace($basePath, '', $uri);
$partes = explode('/', trim($ruta, '/'));