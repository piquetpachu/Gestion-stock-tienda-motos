<?php
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$basePath = '/control_stock/Gestion-stock-tienda-motos/app/';
$ruta = str_replace($basePath, '', $uri);
$partes = explode('/', trim($ruta, '/'));
$recurso = $partes[0] ?? null;

// Reenviamos a cada archivo de rutas
switch ($recurso) {
    case 'productos':
    case 'producto':
    case 'crear_producto':
    case (preg_match('/^actualizar_producto\/\d+$/', $ruta) ? true : false):
    case (preg_match('/^borrar_producto\/\d+$/', $ruta) ? true : false):
        require_once __DIR__ . '/../controllers/productosController.php';
        break;

    case 'usuarios':
    case 'usuario':
    case 'registrar_usuario':
    case 'login':
    case (preg_match('/^actualizar_usuario\/\d+$/', $ruta) ? true : false):
    case (preg_match('/^borrar_usuario\/\d+$/', $ruta) ? true : false):
        require_once __DIR__ . '/../controllers/usuariosController.php';
        break;

    case 'ventas':
    case 'venta':
    case 'crear_venta':
    case 'detalle_venta':
    case (preg_match('/^borrar_venta\/\d+$/', $ruta) ? true : false):
        require_once __DIR__ . '/../controllers/ventasController.php';
        break;

    case 'items_venta':
    case 'agregar_item':
    case (preg_match('/^actualizar_item\/\d+$/', $ruta) ? true : false):
    case (preg_match('/^borrar_item\/\d+$/', $ruta) ? true : false):
        require_once __DIR__ . '/../controllers/ventaItemController.php';
        break;

    case 'cuotas':
    case 'crear_cuota':
    case (preg_match('/^actualizar_cuota\/\d+$/', $ruta) ? true : false):
    case (preg_match('/^borrar_cuota\/\d+$/', $ruta) ? true : false):
        require_once __DIR__ . '/../controllers/ventaCuotaController.php';
        break;

    case 'venta_medios_pago':
    case 'agregar_venta_medio_pago':
    case (preg_match('/^borrar_venta_medio_pago\/\d+$/', $ruta) ? true : false):
        require_once __DIR__ . '/../controllers/ventaMedioPagoController.php';
        break;


    case 'compras':
    case 'compra':
    case 'crear_compra':
    case (preg_match('/^borrar_compra\/\d+$/', $ruta) ? true : false):
        require_once __DIR__ . '/../controllers/comprasController.php';
        break;
    
        case 'compra_medios_pago':
    case 'agregar_compra_medio_pago':
    case (preg_match('/^borrar_compra_medio_pago\/\d+$/', $ruta) ? true : false):
        require_once __DIR__ . '/../controllers/compraMedioPagoController.php';
        break;
        
        
    case 'items_compra':
    case (preg_match('/^borrar_item_compra\/\d+$/', $ruta) ? true : false):
        require_once __DIR__ . '/../controllers/comprasItemController.php';
        break;
    
    case 'rubros':
    case 'rubro':
    case 'crear_rubro':
    case (preg_match('/^actualizar_rubro\/\d+$/', $ruta) ? true : false):
    case (preg_match('/^borrar_rubro\/\d+$/', $ruta) ? true : false):
        require_once __DIR__ . '/../controllers/rubrosController.php';
        break;

    case 'ivas':
    case 'iva':
    case 'crear_iva':
    case (preg_match('/^actualizar_iva\/\d+$/', $ruta) ? true : false):
    case (preg_match('/^borrar_iva\/\d+$/', $ruta) ? true : false):
        require_once __DIR__ . '/../controllers/ivaController.php';
        break;

    case 'medios_pago':
    case 'medio_pago':
    case 'crear_medio_pago':
    case (preg_match('/^actualizar_medio_pago\/\d+$/', $ruta) ? true : false):
    case (preg_match('/^borrar_medio_pago\/\d+$/', $ruta) ? true : false):
        require_once __DIR__ . '/../controllers/medioPagoController.php';
        break;

    case 'clientes':
    case 'cliente':
    case 'crear_cliente':
    case (preg_match('/^actualizar_cliente\/\d+$/', $ruta) ? true : false):
    case (preg_match('/^borrar_cliente\/\d+$/', $ruta) ? true : false):
        require_once __DIR__ . '/../controllers/clientesController.php';
        break;

    case 'movimientos_stock':
    case 'registrar_movimiento_stock':
        require_once __DIR__ . '/../controllers/movimientoStockController.php';
        break;



    default:
        echo json_encode(["error" => "Ruta no válida"]);
        break;
}
