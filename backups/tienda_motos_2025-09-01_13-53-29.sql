-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: tienda_motos
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `caja`
--

DROP TABLE IF EXISTS `caja`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `caja` (
  `id_caja` int(11) NOT NULL AUTO_INCREMENT,
  `fecha` datetime DEFAULT current_timestamp(),
  `tipo` enum('apertura','cierre','ingreso','egreso') NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `motivo` varchar(255) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_caja`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `caja_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `caja`
--

LOCK TABLES `caja` WRITE;
/*!40000 ALTER TABLE `caja` DISABLE KEYS */;
/*!40000 ALTER TABLE `caja` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cliente`
--

DROP TABLE IF EXISTS `cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cliente` (
  `id_cliente` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) DEFAULT NULL,
  `cuil_cuit` varchar(11) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `fecha_alta` date DEFAULT curdate(),
  PRIMARY KEY (`id_cliente`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente`
--

LOCK TABLES `cliente` WRITE;
/*!40000 ALTER TABLE `cliente` DISABLE KEYS */;
INSERT INTO `cliente` VALUES (1,'Carlos','Gómez','55555555555','carlosgomez@mail.com','3794223344','San Martín 456','2025-06-27'),(2,'Juan','Pérez',NULL,'juan@ejemplo.com','1122334455',NULL,'2025-08-15'),(3,'María','Gómez',NULL,'maria@ejemplo.com','1155667788',NULL,'2025-08-15'),(4,'Carlos','López','22222222222','carlos@ejemplo.com','1199887766','nosejajasalu2wee','2025-08-15'),(5,'nacho',NULL,NULL,'nacho@ejemplo.com','1212121212','mi casita','2025-08-15'),(8,'Marmota','Usuario','22222222222','nuevo@nuevo.com','232323','nosejajasalu2wee','2025-08-15'),(10,'nuevo ','usaurio','12121212','carlosgomez@mail.com','3794223344','San Martín 456','2025-08-20'),(11,'otro','usuario','55555555555','qsyo@webon.com','1212121','tucasa','2025-08-20'),(12,'ignacio','Piquet scoffield','33333333333','ignacio@gmail.com','12345678','que te importa','2025-08-24');
/*!40000 ALTER TABLE `cliente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `compra`
--

DROP TABLE IF EXISTS `compra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `compra` (
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `compra`
--

LOCK TABLES `compra` WRITE;
/*!40000 ALTER TABLE `compra` DISABLE KEYS */;
/*!40000 ALTER TABLE `compra` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `compra_item`
--

DROP TABLE IF EXISTS `compra_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `compra_item` (
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `compra_item`
--

LOCK TABLES `compra_item` WRITE;
/*!40000 ALTER TABLE `compra_item` DISABLE KEYS */;
/*!40000 ALTER TABLE `compra_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `compra_medio_pago`
--

DROP TABLE IF EXISTS `compra_medio_pago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `compra_medio_pago` (
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `compra_medio_pago`
--

LOCK TABLES `compra_medio_pago` WRITE;
/*!40000 ALTER TABLE `compra_medio_pago` DISABLE KEYS */;
/*!40000 ALTER TABLE `compra_medio_pago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `iva`
--

DROP TABLE IF EXISTS `iva`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `iva` (
  `id_iva` int(11) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(50) DEFAULT NULL,
  `porcentaje` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`id_iva`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `iva`
--

LOCK TABLES `iva` WRITE;
/*!40000 ALTER TABLE `iva` DISABLE KEYS */;
INSERT INTO `iva` VALUES (1,'IVA 21%',21.00),(2,'Exento',0.00);
/*!40000 ALTER TABLE `iva` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medio_pago`
--

DROP TABLE IF EXISTS `medio_pago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `medio_pago` (
  `id_medio_pago` int(11) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_medio_pago`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medio_pago`
--

LOCK TABLES `medio_pago` WRITE;
/*!40000 ALTER TABLE `medio_pago` DISABLE KEYS */;
INSERT INTO `medio_pago` VALUES (1,'Efectivo'),(2,'Tarjeta de crédito'),(3,'Transferencia bancaria');
/*!40000 ALTER TABLE `medio_pago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movimiento_stock`
--

DROP TABLE IF EXISTS `movimiento_stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `movimiento_stock` (
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movimiento_stock`
--

LOCK TABLES `movimiento_stock` WRITE;
/*!40000 ALTER TABLE `movimiento_stock` DISABLE KEYS */;
INSERT INTO `movimiento_stock` VALUES (1,1,'egreso',1,'2025-06-27 13:50:16','Venta ID 1'),(2,2,'egreso',2,'2025-06-27 13:50:16','Venta ID 1');
/*!40000 ALTER TABLE `movimiento_stock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `producto`
--

DROP TABLE IF EXISTS `producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `producto` (
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
) ENGINE=InnoDB AUTO_INCREMENT=127 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producto`
--

LOCK TABLES `producto` WRITE;
/*!40000 ALTER TABLE `producto` DISABLE KEYS */;
INSERT INTO `producto` VALUES (1,'Casco Integral GPX','Casco de alta seguridad, negro mate.',30000.00,18000.00,-1,1,1,'2025-06-27',0,2.00,'7798765432109'),(2,'Aceite 10W40 Motul','Lubricante sintético para motos 4T.',8000.00,5200.00,1,1,2,'2025-06-27',1,5.00,'1234567890123'),(45,'articulo de prueba','para comprarlo XD',1000.00,500.00,9,1,1,'2025-07-23',0,1.00,'9567087638096');
/*!40000 ALTER TABLE `producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proveedor`
--

DROP TABLE IF EXISTS `proveedor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `proveedor` (
  `id_proveedor` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `cuit` varchar(20) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_proveedor`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proveedor`
--

LOCK TABLES `proveedor` WRITE;
/*!40000 ALTER TABLE `proveedor` DISABLE KEYS */;
INSERT INTO `proveedor` VALUES (1,'Proveedora Motos SRL','20-12345678-9','3794000000','ventas@proveedora.com','Calle 123, Corrientes'),(2,'Accesorios Ruta 10','30-98765432-1','3794111111','info@ruta10.com','Av. Rápida 999, Corrientes'),(3,'sadasd',NULL,NULL,NULL,NULL),(4,'12134wad',NULL,NULL,NULL,NULL),(5,'poapsodp',NULL,NULL,NULL,NULL),(8,'pepepepepepepepep',NULL,'121212121',NULL,'actualiza?');
/*!40000 ALTER TABLE `proveedor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rubro`
--

DROP TABLE IF EXISTS `rubro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rubro` (
  `id_rubro` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id_rubro`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rubro`
--

LOCK TABLES `rubro` WRITE;
/*!40000 ALTER TABLE `rubro` DISABLE KEYS */;
INSERT INTO `rubro` VALUES (1,'Cascos'),(2,'Aceites'),(3,'Luces'),(4,'reliquias');
/*!40000 ALTER TABLE `rubro` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `contrasena` varchar(255) DEFAULT NULL,
  `rol` enum('admin','vendedor') DEFAULT 'vendedor',
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `unique_nombre` (`nombre`),
  UNIQUE KEY `unique_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'Admin Principal','admin@tienda.com','admin123','admin'),(2,'Vendedor Juan','juan@tienda.com','juan123','vendedor'),(5,'pepe','pepe@gmail.com','$2y$10$zzfXMAPHJh/PezqP8c5VmeOnlvg8JItWcBd5BhOHqXS7E.MS.WacW','admin'),(6,'Juan','juan@mail.com','$2y$10$U6OoNG6fxfaNOTqp1DK09.J/FyXYN4CFIItZ/Fs9xjeu9mv9TQPo6','admin'),(7,'caro','caro@ejemplo.com','$2y$10$/P21AX/QVCkm2LxnmSJak.96QwRg5ds9mc8F2XDwnNcTw4IIJzSDO','vendedor'),(8,'nacho','nacho@ejemplo.com','$2y$10$s43858Aui8uSmytljZS59OmxSCN/tSKWWnae9U/HjuvYhqI3Y3xV2','admin'),(9,'pepito','pepe@ejemplo.com','$2y$10$JtjtCdwpwcb/ESD345w1NeSUIaC/3K/Ni219WbHSoZk5KsZefBFmG','admin'),(10,'michi','michi@gmail.com','$2y$10$7GpaEf0gr.j29svbd3YGxuTWZCy2tntTRc376AZqMb18WcZ8ub2WG','admin'),(14,'asd','asd@ejemplo.com','$2y$10$SZSpJHhR4p0JfyEMF7mI4OR7D/.YF39WVYb619IT5x59wWpYAhcxq','admin'),(26,'nacho5','nachqweo@ejemplo.com','$2y$10$AiBQ0uXqfIY/mPBi67ORuuGz3MsnOWldW9Lq5YS7T6UkP9eaBjTtO','admin'),(27,'nacho55','nachqweo5@ejemplo.com','$2y$10$Tu1ksaiAtnfQsdT68Uzyi.xpyWo/6Z3Cd9eg6ynvPYuo0jTJzvp46','admin'),(30,'prueba 2 ','prueba2@gmail.com','$2y$10$8X6oPUP6ByAGuEsPb8Qlb.2aSzPVAyF/8evjn8Oe0oQDWqqeyN4KC',''),(33,'123','123@gmail.com','$2y$10$hAuuQgA92FFWFROS3pTc8uardiBFR2xITtascP7tbP2hDL90pHDka','vendedor'),(34,'Celunacho','celu@ejemplo.com','$2y$10$VyyoKckbzgQeZZzPHHIg8uiYKLE5DZQtWyjNtI3D8bxWmbBcWSk3W','admin');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `venta`
--

DROP TABLE IF EXISTS `venta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `venta` (
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
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `venta`
--

LOCK TABLES `venta` WRITE;
/*!40000 ALTER TABLE `venta` DISABLE KEYS */;
INSERT INTO `venta` VALUES (1,'2025-06-27 13:50:16',46500.00,'Factura B','0001-00001234',1,2,NULL),(2,'2025-06-27 14:17:35',58000.00,'Factura B','0002-00001245',1,2,1),(3,'2025-07-19 20:55:29',36.30,'Factura A','0001-00000001',1,1,NULL),(4,'2025-07-19 20:55:55',9.68,'Factura A','0001-00000001',1,1,NULL),(6,'2025-07-21 16:18:48',36.30,'Factura A','0001-00000001',1,1,NULL),(7,'2025-07-21 16:19:42',36.30,'Factura A','0001-00000001',1,1,NULL),(8,'2025-07-21 16:23:32',36.30,'Factura A','0001-00000001',1,1,NULL),(9,'2025-07-21 16:25:35',9.68,'Factura A','0001-00000001',1,1,NULL),(10,'2025-07-21 16:26:31',91.96,'Factura A','0001-00000001',1,1,NULL),(11,'2025-07-21 16:30:10',36.30,'Factura A','0001-00000001',1,1,NULL),(12,'2025-07-21 16:31:31',118.58,'Factura A','0001-00000001',1,1,NULL),(13,'2025-07-21 16:33:33',36.30,'Factura A','0001-00000001',1,1,NULL),(14,'2025-07-21 16:39:25',36.30,'Factura A','0001-00000001',1,1,NULL),(16,'2025-07-21 21:44:16',29.04,'Factura A','0001-00000001',1,1,NULL),(17,'2025-07-21 21:58:40',363.00,'Factura A','0001-00000001',1,1,NULL),(18,'2025-07-22 17:10:35',36.30,'Factura A','0001-00000001',1,1,NULL),(19,'2025-07-23 16:09:55',166.98,'Factura A','0001-00000001',1,1,NULL),(20,'2025-07-23 16:13:23',2.42,'Factura A','0001-00000001',1,1,NULL),(21,'2025-07-23 20:38:51',36.30,'Factura A','0001-00000001',1,1,NULL),(24,'2025-08-11 20:20:08',NULL,NULL,NULL,NULL,NULL,NULL),(25,'2025-08-11 20:20:20',NULL,NULL,NULL,NULL,NULL,NULL),(26,'2025-08-11 20:20:20',NULL,NULL,NULL,NULL,NULL,NULL),(27,'2025-08-11 20:20:22',NULL,NULL,NULL,NULL,NULL,NULL),(28,'2025-08-11 20:20:26',NULL,NULL,NULL,NULL,NULL,NULL),(29,'2025-08-11 20:20:28',NULL,NULL,NULL,NULL,NULL,NULL),(30,'2025-08-11 20:20:29',NULL,NULL,NULL,NULL,NULL,NULL),(31,'2025-08-11 20:20:29',NULL,NULL,NULL,NULL,NULL,NULL),(32,'2025-08-11 20:20:54',NULL,NULL,NULL,NULL,NULL,NULL),(33,'2025-08-11 21:06:18',36.30,'TICKET','1754957178387',1,1,NULL),(34,'2025-08-11 21:08:05',36.30,'TICKET','1754957285047',1,1,NULL),(35,'2025-08-11 21:13:46',36.30,'TICKET','1754957626631',1,1,NULL),(36,'2025-08-11 21:14:31',9.68,'TICKET','1754957671196',1,1,NULL),(37,'2025-08-11 21:16:18',9.68,'TICKET','1754957778723',1,1,NULL),(38,'2025-08-12 08:31:46',9.68,'TICKET','1754998306062',1,1,NULL),(39,'2025-08-13 10:05:52',29.04,'TICKET','1755090352661',1,1,NULL),(40,'2025-08-13 10:06:42',19.36,'TICKET','1755090402572',1,1,NULL),(41,'2025-08-13 10:15:10',36.30,'TICKET','1755090910357',1,1,NULL),(42,'2025-08-14 14:15:28',36.30,'TICKET','1755191727972',1,1,NULL),(43,'2025-08-14 15:10:08',1452.00,'TICKET','1755195008200',1,1,NULL),(44,'0000-00-00 00:00:00',24200.00,'TICKET','1755195323510',1,1,NULL),(45,'2025-08-15 15:26:46',121.00,'TICKET','1755282406100',1,1,NULL),(46,'2025-08-16 11:13:49',9.68,'TICKET','1755353629002',1,1,NULL),(47,'2025-08-17 20:07:07',131.41,'TICKET','1755472027511',1,1,NULL),(48,'2025-08-17 20:07:52',9.68,'TICKET','1755472072525',1,1,NULL),(49,'2025-08-18 08:36:39',121.00,'TICKET','1755516999217',1,1,NULL),(50,'2025-08-18 08:37:10',278.42,'TICKET','1755517030465',1,1,NULL),(51,'2025-08-18 18:56:16',9.68,'TICKET','1755554176231',1,1,NULL),(52,'2025-08-24 20:47:43',94.38,'TICKET','1756079263626',1,1,NULL),(53,'2025-08-24 20:53:04',19.98,'TICKET','1756079584654',1,1,NULL),(54,'2025-08-24 20:53:42',10.29,'TICKET','1756079622376',1,1,NULL),(55,'2025-08-26 16:38:04',45.98,'TICKET','1756237084578',1,1,NULL),(56,'2025-08-27 09:59:03',36.30,'TICKET','1756299543735',1,1,NULL),(57,'2025-08-29 15:12:54',36.30,'TICKET','1756491174504',1,1,NULL);
/*!40000 ALTER TABLE `venta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `venta_cuota`
--

DROP TABLE IF EXISTS `venta_cuota`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `venta_cuota` (
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `venta_cuota`
--

LOCK TABLES `venta_cuota` WRITE;
/*!40000 ALTER TABLE `venta_cuota` DISABLE KEYS */;
INSERT INTO `venta_cuota` VALUES (1,1,46500.00000,'2025-07-27',46500.00000,NULL,NULL);
/*!40000 ALTER TABLE `venta_cuota` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `venta_item`
--

DROP TABLE IF EXISTS `venta_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `venta_item` (
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
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `venta_item`
--

LOCK TABLES `venta_item` WRITE;
/*!40000 ALTER TABLE `venta_item` DISABLE KEYS */;
INSERT INTO `venta_item` VALUES (70,55,1,1,30000.00,0.00000,21.00000),(71,55,2,1,8000.00,0.00000,21.00000),(72,56,1,1,30000.00,0.00000,21.00000),(73,57,1,1,30000.00,0.00000,21.00000);
/*!40000 ALTER TABLE `venta_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `venta_medio_pago`
--

DROP TABLE IF EXISTS `venta_medio_pago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `venta_medio_pago` (
  `id_venta_medio_pago` int(11) NOT NULL AUTO_INCREMENT,
  `id_venta` int(11) DEFAULT NULL,
  `id_medio_pago` int(11) DEFAULT NULL,
  `monto` decimal(10,2) DEFAULT NULL,
  `cuil_cuit` varchar(20) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  PRIMARY KEY (`id_venta_medio_pago`),
  KEY `id_venta` (`id_venta`),
  KEY `id_medio_pago` (`id_medio_pago`),
  CONSTRAINT `venta_medio_pago_ibfk_1` FOREIGN KEY (`id_venta`) REFERENCES `venta` (`id_venta`),
  CONSTRAINT `venta_medio_pago_ibfk_2` FOREIGN KEY (`id_medio_pago`) REFERENCES `medio_pago` (`id_medio_pago`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `venta_medio_pago`
--

LOCK TABLES `venta_medio_pago` WRITE;
/*!40000 ALTER TABLE `venta_medio_pago` DISABLE KEYS */;
INSERT INTO `venta_medio_pago` VALUES (54,55,1,45.98,NULL,'2025-08-26'),(55,56,1,36.30,NULL,'2025-08-27'),(56,57,1,36.30,NULL,'2025-08-29');
/*!40000 ALTER TABLE `venta_medio_pago` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-01  8:53:29
