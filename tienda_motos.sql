-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         10.4.32-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.7.0.6850
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para tienda_motos
CREATE DATABASE IF NOT EXISTS `tienda_motos` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `tienda_motos`;

-- Volcando estructura para tabla tienda_motos.cliente
CREATE TABLE IF NOT EXISTS `cliente` (
  `id_cliente` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) DEFAULT NULL,
  `dni` varchar(20) DEFAULT NULL,
  `cuil_cuit` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `fecha_alta` date DEFAULT curdate(),
  PRIMARY KEY (`id_cliente`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla tienda_motos.cliente: ~0 rows (aproximadamente)
INSERT INTO `cliente` (`id_cliente`, `nombre`, `apellido`, `dni`, `cuil_cuit`, `email`, `telefono`, `direccion`, `fecha_alta`) VALUES
	(1, 'Carlos', 'Gómez', '33222444', NULL, 'carlosgomez@mail.com', '3794223344', 'San Martín 456', '2025-06-27');

-- Volcando estructura para tabla tienda_motos.compra
CREATE TABLE IF NOT EXISTS `compra` (
  `id_compra` int(11) NOT NULL AUTO_INCREMENT,
  `fecha` datetime DEFAULT current_timestamp(),
  `monto_total` decimal(10,2) DEFAULT NULL,
  `tipo_comprobante` varchar(50) DEFAULT NULL,
  `nro_comprobante` varchar(50) DEFAULT NULL,
  `id_proveedor` int(11) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_compra`),
  KEY `id_proveedor` (`id_proveedor`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `compra_ibfk_1` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedor` (`id_proveedor`),
  CONSTRAINT `compra_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla tienda_motos.compra: ~0 rows (aproximadamente)
INSERT INTO `compra` (`id_compra`, `fecha`, `monto_total`, `tipo_comprobante`, `nro_comprobante`, `id_proveedor`, `id_usuario`) VALUES
	(1, '2025-06-27 13:50:16', 28400.00, 'Factura A', 'A-1001-0000456', 1, 1);

-- Volcando estructura para tabla tienda_motos.compra_item
CREATE TABLE IF NOT EXISTS `compra_item` (
  `id_compra_item` int(11) NOT NULL AUTO_INCREMENT,
  `id_compra` int(11) DEFAULT NULL,
  `id_producto` int(11) DEFAULT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `precio_unitario` decimal(10,2) DEFAULT NULL,
  `iva` double(15,5) DEFAULT NULL,
  PRIMARY KEY (`id_compra_item`),
  KEY `id_compra` (`id_compra`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `compra_item_ibfk_1` FOREIGN KEY (`id_compra`) REFERENCES `compra` (`id_compra`),
  CONSTRAINT `compra_item_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla tienda_motos.compra_item: ~2 rows (aproximadamente)
INSERT INTO `compra_item` (`id_compra_item`, `id_compra`, `id_producto`, `cantidad`, `precio_unitario`, `iva`) VALUES
	(1, 1, 2, 10, 5200.00, 1092.00000),
	(2, 1, 3, 5, 6000.00, 630.00000);

-- Volcando estructura para tabla tienda_motos.compra_medio_pago
CREATE TABLE IF NOT EXISTS `compra_medio_pago` (
  `id_compra_medio_pago` int(11) NOT NULL AUTO_INCREMENT,
  `id_compra` int(11) DEFAULT NULL,
  `id_medio_pago` int(11) DEFAULT NULL,
  `monto` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id_compra_medio_pago`),
  KEY `id_compra` (`id_compra`),
  KEY `id_medio_pago` (`id_medio_pago`),
  CONSTRAINT `compra_medio_pago_ibfk_1` FOREIGN KEY (`id_compra`) REFERENCES `compra` (`id_compra`),
  CONSTRAINT `compra_medio_pago_ibfk_2` FOREIGN KEY (`id_medio_pago`) REFERENCES `medio_pago` (`id_medio_pago`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla tienda_motos.compra_medio_pago: ~0 rows (aproximadamente)
INSERT INTO `compra_medio_pago` (`id_compra_medio_pago`, `id_compra`, `id_medio_pago`, `monto`) VALUES
	(1, 1, 3, 28400.00);

-- Volcando estructura para tabla tienda_motos.iva
CREATE TABLE IF NOT EXISTS `iva` (
  `id_iva` int(11) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(50) DEFAULT NULL,
  `porcentaje` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`id_iva`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla tienda_motos.iva: ~2 rows (aproximadamente)
INSERT INTO `iva` (`id_iva`, `descripcion`, `porcentaje`) VALUES
	(1, 'IVA 21%', 21.00),
	(2, 'Exento', 0.00);

-- Volcando estructura para tabla tienda_motos.medio_pago
CREATE TABLE IF NOT EXISTS `medio_pago` (
  `id_medio_pago` int(11) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_medio_pago`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla tienda_motos.medio_pago: ~3 rows (aproximadamente)
INSERT INTO `medio_pago` (`id_medio_pago`, `descripcion`) VALUES
	(1, 'Efectivo'),
	(2, 'Tarjeta de crédito'),
	(3, 'Transferencia bancaria');

-- Volcando estructura para tabla tienda_motos.movimiento_stock
CREATE TABLE IF NOT EXISTS `movimiento_stock` (
  `id_movimiento` int(11) NOT NULL AUTO_INCREMENT,
  `id_producto` int(11) DEFAULT NULL,
  `tipo` enum('ingreso','egreso') DEFAULT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `fecha` datetime DEFAULT current_timestamp(),
  `motivo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_movimiento`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `movimiento_stock_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla tienda_motos.movimiento_stock: ~4 rows (aproximadamente)
INSERT INTO `movimiento_stock` (`id_movimiento`, `id_producto`, `tipo`, `cantidad`, `fecha`, `motivo`) VALUES
	(1, 1, 'egreso', 1, '2025-06-27 13:50:16', 'Venta ID 1'),
	(2, 2, 'egreso', 2, '2025-06-27 13:50:16', 'Venta ID 1'),
	(3, 2, 'ingreso', 10, '2025-06-27 13:50:16', 'Compra ID 1'),
	(4, 3, 'ingreso', 5, '2025-06-27 13:50:16', 'Compra ID 1');

-- Volcando estructura para tabla tienda_motos.producto
CREATE TABLE IF NOT EXISTS `producto` (
  `id_producto` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio_venta` decimal(10,2) NOT NULL,
  `precio_compra` decimal(10,2) DEFAULT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `id_proveedor` int(11) DEFAULT NULL,
  `id_rubro` int(11) DEFAULT NULL,
  `fecha_alta` date DEFAULT curdate(),
  `activo` tinyint(1) DEFAULT 1,
  `stock_minimo` double(15,2) DEFAULT 0.00,
  `codigo_barras` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_producto`),
  UNIQUE KEY `codigo_barras` (`codigo_barras`),
  KEY `id_proveedor` (`id_proveedor`),
  KEY `id_rubro` (`id_rubro`),
  CONSTRAINT `producto_ibfk_1` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedor` (`id_proveedor`),
  CONSTRAINT `producto_ibfk_2` FOREIGN KEY (`id_rubro`) REFERENCES `rubro` (`id_rubro`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla tienda_motos.producto: ~3 rows (aproximadamente)
INSERT INTO `producto` (`id_producto`, `nombre`, `descripcion`, `precio_venta`, `precio_compra`, `stock`, `id_proveedor`, `id_rubro`, `fecha_alta`, `activo`, `stock_minimo`, `codigo_barras`) VALUES
	(1, 'Casco Integral GPX', 'Casco de alta seguridad, negro mate.', 30000.00, 18000.00, 10, 1, 1, '2025-06-27', 1, 2.00, '7798765432109'),
	(2, 'Aceite 10W40 Motul', 'Lubricante sintético para motos 4T.', 8000.00, 5200.00, 20, 1, 2, '2025-06-27', 1, 5.00, '1234567890123'),
	(3, 'Faro LED Universal', 'Faro blanco adaptable a varias motos.', 9500.00, 6000.00, 15, 2, 3, '2025-06-27', 1, 3.00, '8934567890532');

-- Volcando estructura para tabla tienda_motos.proveedor
CREATE TABLE IF NOT EXISTS `proveedor` (
  `id_proveedor` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `cuit` varchar(20) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_proveedor`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla tienda_motos.proveedor: ~2 rows (aproximadamente)
INSERT INTO `proveedor` (`id_proveedor`, `nombre`, `cuit`, `telefono`, `email`, `direccion`) VALUES
	(1, 'Proveedora Motos SRL', '20-12345678-9', '3794000000', 'ventas@proveedora.com', 'Calle 123, Corrientes'),
	(2, 'Accesorios Ruta 10', '30-98765432-1', '3794111111', 'info@ruta10.com', 'Av. Rápida 999, Corrientes');

-- Volcando estructura para tabla tienda_motos.rubro
CREATE TABLE IF NOT EXISTS `rubro` (
  `id_rubro` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id_rubro`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla tienda_motos.rubro: ~3 rows (aproximadamente)
INSERT INTO `rubro` (`id_rubro`, `nombre`) VALUES
	(1, 'Cascos'),
	(2, 'Aceites'),
	(3, 'Luces');

-- Volcando estructura para tabla tienda_motos.usuario
CREATE TABLE IF NOT EXISTS `usuario` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `contrasena` varchar(255) DEFAULT NULL,
  `rol` enum('admin','vendedor') DEFAULT 'vendedor',
  PRIMARY KEY (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla tienda_motos.usuario: ~4 rows (aproximadamente)
INSERT INTO `usuario` (`id_usuario`, `nombre`, `email`, `contrasena`, `rol`) VALUES
	(1, 'Admin Principal', 'admin@tienda.com', 'admin123', 'admin'),
	(2, 'Vendedor Juan', 'juan@tienda.com', 'juan123', 'vendedor'),
	(4, 'Juan', 'juan@mail.com', '$2y$10$jbqkdQlReIklgaPYyzYpquBw7Jy4hIElpP28.dh37U8Zq7OCa1PvS', 'admin'),
	(5, 'pepe', 'pepe@gmail.com', '$2y$10$zzfXMAPHJh/PezqP8c5VmeOnlvg8JItWcBd5BhOHqXS7E.MS.WacW', 'admin');

-- Volcando estructura para tabla tienda_motos.venta
CREATE TABLE IF NOT EXISTS `venta` (
  `id_venta` int(11) NOT NULL AUTO_INCREMENT,
  `fecha` datetime DEFAULT current_timestamp(),
  `monto_total` decimal(10,2) DEFAULT NULL,
  `tipo_comprobante` varchar(50) DEFAULT NULL,
  `nro_comprobante` varchar(50) DEFAULT NULL,
  `id_iva` int(11) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `id_cliente` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_venta`),
  KEY `id_iva` (`id_iva`),
  KEY `id_usuario` (`id_usuario`),
  KEY `fk_venta_cliente` (`id_cliente`),
  CONSTRAINT `fk_venta_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`),
  CONSTRAINT `venta_ibfk_1` FOREIGN KEY (`id_iva`) REFERENCES `iva` (`id_iva`),
  CONSTRAINT `venta_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla tienda_motos.venta: ~0 rows (aproximadamente)
INSERT INTO `venta` (`id_venta`, `fecha`, `monto_total`, `tipo_comprobante`, `nro_comprobante`, `id_iva`, `id_usuario`, `id_cliente`) VALUES
	(1, '2025-06-27 13:50:16', 46500.00, 'Factura B', '0001-00001234', 1, 2, NULL),
	(2, '2025-06-27 14:17:35', 58000.00, 'Factura B', '0002-00001245', 1, 2, 1);

-- Volcando estructura para tabla tienda_motos.venta_cuota
CREATE TABLE IF NOT EXISTS `venta_cuota` (
  `id_cuota` int(11) NOT NULL AUTO_INCREMENT,
  `id_venta` int(11) DEFAULT NULL,
  `valor` double(15,5) DEFAULT NULL,
  `fecha_venc` date DEFAULT NULL,
  `valor_venc` double(15,5) DEFAULT NULL,
  `fecha_pago` date DEFAULT NULL,
  `valor_pago` double(15,5) DEFAULT NULL,
  PRIMARY KEY (`id_cuota`),
  KEY `id_venta` (`id_venta`),
  CONSTRAINT `venta_cuota_ibfk_1` FOREIGN KEY (`id_venta`) REFERENCES `venta` (`id_venta`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla tienda_motos.venta_cuota: ~0 rows (aproximadamente)
INSERT INTO `venta_cuota` (`id_cuota`, `id_venta`, `valor`, `fecha_venc`, `valor_venc`, `fecha_pago`, `valor_pago`) VALUES
	(1, 1, 46500.00000, '2025-07-27', 46500.00000, NULL, NULL);

-- Volcando estructura para tabla tienda_motos.venta_item
CREATE TABLE IF NOT EXISTS `venta_item` (
  `id_venta_item` int(11) NOT NULL AUTO_INCREMENT,
  `id_venta` int(11) DEFAULT NULL,
  `id_producto` int(11) DEFAULT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `precio_unitario` decimal(10,2) DEFAULT NULL,
  `descuento` double(15,5) DEFAULT NULL,
  `iva` double(15,5) DEFAULT NULL,
  PRIMARY KEY (`id_venta_item`),
  KEY `id_venta` (`id_venta`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `venta_item_ibfk_1` FOREIGN KEY (`id_venta`) REFERENCES `venta` (`id_venta`),
  CONSTRAINT `venta_item_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla tienda_motos.venta_item: ~2 rows (aproximadamente)
INSERT INTO `venta_item` (`id_venta_item`, `id_venta`, `id_producto`, `cantidad`, `precio_unitario`, `descuento`, `iva`) VALUES
	(1, 1, 1, 1, 30000.00, 0.00000, 6300.00000),
	(2, 1, 2, 2, 8000.00, 500.00000, 3360.00000);

-- Volcando estructura para tabla tienda_motos.venta_medio_pago
CREATE TABLE IF NOT EXISTS `venta_medio_pago` (
  `id_venta_medio_pago` int(11) NOT NULL AUTO_INCREMENT,
  `id_venta` int(11) DEFAULT NULL,
  `id_medio_pago` int(11) DEFAULT NULL,
  `monto` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id_venta_medio_pago`),
  KEY `id_venta` (`id_venta`),
  KEY `id_medio_pago` (`id_medio_pago`),
  CONSTRAINT `venta_medio_pago_ibfk_1` FOREIGN KEY (`id_venta`) REFERENCES `venta` (`id_venta`),
  CONSTRAINT `venta_medio_pago_ibfk_2` FOREIGN KEY (`id_medio_pago`) REFERENCES `medio_pago` (`id_medio_pago`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla tienda_motos.venta_medio_pago: ~2 rows (aproximadamente)
INSERT INTO `venta_medio_pago` (`id_venta_medio_pago`, `id_venta`, `id_medio_pago`, `monto`) VALUES
	(1, 1, 1, 20000.00),
	(2, 1, 2, 26500.00);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;



-- Eliminar columnas que ya no querés (si existen)
ALTER TABLE venta_medio_pago
  DROP COLUMN nombre_titular
,
DROP COLUMN numero_tarjeta,
DROP COLUMN fecha_vencimiento,
DROP COLUMN dni,
DROP COLUMN id_cuenta_corriente;

-- Agregar columnas nuevas para CUIL/CUIT y fecha (si no existen)
ALTER TABLE venta_medio_pago
  ADD COLUMN cuil_cuit VARCHAR
(20) DEFAULT NULL,
ADD COLUMN fecha DATE DEFAULT NULL;


-- Crear tabla caja_retiro
CREATE TABLE
IF NOT EXISTS `caja_retiro`
(
  `id_retiro` INT
(11) NOT NULL AUTO_INCREMENT,
  `id_caja` INT
(11) NOT NULL,
  `monto` DECIMAL
(10,2) NOT NULL,
  `motivo` VARCHAR
(255) DEFAULT NULL,
  `fecha` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY
(`id_retiro`),
  FOREIGN KEY
(`id_caja`) REFERENCES `caja`
(`id_caja`)
);

-- Agregar columnas  a la tabla caja
ALTER TABLE `caja`
ADD COLUMN
IF NOT EXISTS `total_ventas` DECIMAL
(10,2) DEFAULT 0,
ADD COLUMN
IF NOT EXISTS `total_retiros` DECIMAL
(10,2) DEFAULT 0,
ADD COLUMN
IF NOT EXISTS `total_final` DECIMAL
(10,2) DEFAULT 0,
ADD COLUMN
IF NOT EXISTS `cerrada` TINYINT
(1) DEFAULT 0;


-- Cliente genérico por defecto
INSERT INTO cliente (id_cliente, nombre, apellido, dni, cuil_cuit, email, telefono, direccion, fecha_alta)
VALUES (0, 'Consumidor', 'Final', NULL, NULL, NULL, NULL, NULL, CURDATE())
ON DUPLICATE KEY UPDATE nombre = 'Consumidor', apellido = 'Final';
