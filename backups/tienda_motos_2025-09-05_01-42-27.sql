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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `caja`
--

LOCK TABLES `caja` WRITE;
/*!40000 ALTER TABLE `caja` DISABLE KEYS */;
INSERT INTO `caja` VALUES (2,'2025-08-11 00:00:00','apertura',30.00,'Monto inicial apertura',1);
/*!40000 ALTER TABLE `caja` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `caja_retiro`
--

DROP TABLE IF EXISTS `caja_retiro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `caja_retiro` (
  `id_retiro` int(11) NOT NULL AUTO_INCREMENT,
  `id_caja` int(11) NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `motivo` varchar(255) DEFAULT NULL,
  `fecha` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_retiro`),
  KEY `id_caja` (`id_caja`),
  CONSTRAINT `caja_retiro_ibfk_1` FOREIGN KEY (`id_caja`) REFERENCES `caja` (`id_caja`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `caja_retiro`
--

LOCK TABLES `caja_retiro` WRITE;
/*!40000 ALTER TABLE `caja_retiro` DISABLE KEYS */;
/*!40000 ALTER TABLE `caja_retiro` ENABLE KEYS */;
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
  `dni` varchar(20) DEFAULT NULL,
  `cuil_cuit` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `fecha_alta` date DEFAULT curdate(),
  PRIMARY KEY (`id_cliente`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente`
--

LOCK TABLES `cliente` WRITE;
/*!40000 ALTER TABLE `cliente` DISABLE KEYS */;
INSERT INTO `cliente` VALUES (1,'Carlos','Gómez','33222444','11111111111','carlosgomez@mail.com','3794223344','San Martín 456','2025-06-27'),(2,'jaun','apellido','1234567uio',NULL,'juan@jaja.cm','234567','hahsq57','2025-08-19'),(3,'maria','gomez','23456787',NULL,'maria@gmail.com','12345678','hha12','2025-08-19'),(4,'nacho','elermoso','1212121212',NULL,'elermoso@asd.com','12121212','abajo de su cama','2025-08-19'),(5,'carlos','lopez',NULL,'99999999999','carlos@gmail.com','999999999999','kamskc','2025-08-24'),(6,'carla','lpm',NULL,'99999999999','lpm@gmail.com','9999999999','cnancsjs','2025-08-24'),(7,'jjdc','mas c a',NULL,'77-77777777-7','cajscj@gmial.com','12122','sam casc','2025-08-26'),(8,'mm','mm',NULL,'88-88888888-8','mm@gmail.com','888','njkhkj','2025-08-27'),(9,'Consumidor','Final',NULL,NULL,NULL,NULL,NULL,'2025-09-02');
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
INSERT INTO `compra` VALUES (1,'2025-06-27 13:50:16',28400.00,'Factura A','A-1001-0000456',1,1);
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
INSERT INTO `compra_item` VALUES (1,1,2,10,5200.00,1092.00000),(2,1,3,5,6000.00,630.00000);
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
INSERT INTO `movimiento_stock` VALUES (1,1,'egreso',1,'2025-06-27 13:50:16','Venta ID 1'),(2,2,'egreso',2,'2025-06-27 13:50:16','Venta ID 1'),(3,2,'ingreso',10,'2025-06-27 13:50:16','Compra ID 1'),(4,3,'ingreso',5,'2025-06-27 13:50:16','Compra ID 1');
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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producto`
--

LOCK TABLES `producto` WRITE;
/*!40000 ALTER TABLE `producto` DISABLE KEYS */;
INSERT INTO `producto` VALUES (1,'Casco Integral GPX','Casco de alta seguridad, negro mate.',30000.00,18000.00,29,1,1,'2025-06-27',0,2.00,'7798765432109'),(2,'Aceite 10W40 Motul','Lubricante sintético para motos 4T.',8000.00,5200.00,2,1,2,'2025-06-27',1,5.00,'1234567890123'),(3,'Faro LED Universal','Faro blanco adaptable a varias motos.',9500.00,6000.00,-39,2,3,'2025-06-27',1,3.00,'8934567890532'),(7,'hola','hola2',123.00,12.00,12,1,3,'2025-08-18',0,3.00,'1234567890'),(8,'vendedor','22',12.00,12.00,11,1,1,'2025-08-18',0,1.00,'9186432496855'),(9,'jhgf','hjgj',1.00,0.00,-1,NULL,NULL,'2025-08-18',0,0.00,'7084121358670'),(10,'kdskd','asd',1231.00,12.00,-1,1,1,'2025-08-18',0,122.00,'0102359891299');
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proveedor`
--

LOCK TABLES `proveedor` WRITE;
/*!40000 ALTER TABLE `proveedor` DISABLE KEYS */;
INSERT INTO `proveedor` VALUES (1,'Proveedora Motos SRL','20-12345678-9','3794000000','ventas@proveedora.com','Calle 123, Corrientes'),(2,'Accesorios Ruta 10','30-98765432-1','3794111111','info@ruta10.com','Av. Rápida 999, Corrientes');
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rubro`
--

LOCK TABLES `rubro` WRITE;
/*!40000 ALTER TABLE `rubro` DISABLE KEYS */;
INSERT INTO `rubro` VALUES (1,'Cascos'),(2,'Aceites'),(3,'Luces');
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
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'Admin Principal','admin@tienda.com','admin123','admin'),(2,'Vendedor Juan','juan@tienda.com','juan123','vendedor'),(4,'Juan','juan@mail.com','$2y$10$jbqkdQlReIklgaPYyzYpquBw7Jy4hIElpP28.dh37U8Zq7OCa1PvS','admin'),(5,'pepe','pepe@gmail.com','$2y$10$zzfXMAPHJh/PezqP8c5VmeOnlvg8JItWcBd5BhOHqXS7E.MS.WacW','admin'),(11,'caroo','caro@caro','$2y$10$nnowi6O4Opb8tlCqUlm05.DmnOncqcUZFt1UmNL/MgHLs7bgiTAOG','vendedor'),(12,'carooadmin','carooadmin@admin','$2y$10$KXHy6BHBFIvLkxtKMDWSpeka4rnd7.MbuCj41dJFUY1azKbHj6VuC','admin'),(13,'nacho','nacho@gmail.com','$2y$10$hBjLM76nZ6gxJEc9zbvWr.4qg8P6FRO9lT0Y1ZAPqJweU9hrheWDa','');
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
INSERT INTO `venta` VALUES (1,'2025-06-27 13:50:16',46500.00,'Factura B','0001-00001234',1,2,NULL),(2,'2025-06-27 14:17:35',58000.00,'Factura B','0002-00001245',1,2,1),(3,'2025-07-19 21:24:40',32.67,'Factura A','0001-00000001',1,1,NULL),(4,'2025-07-21 14:50:39',189.49,'Factura A','0001-00000001',1,1,NULL),(5,'2025-07-21 14:59:52',196.02,'Factura A','0001-00000001',1,1,NULL),(6,'2025-07-21 15:12:49',145.20,'Factura A','0001-00000001',1,1,NULL),(7,'2025-07-21 15:13:48',82.76,'Factura A','0001-00000001',1,1,NULL),(8,'2025-07-21 15:43:21',101.64,'Factura A','0001-00000001',1,1,NULL),(9,'2025-07-21 15:44:18',36.30,'Factura A','0001-00000001',1,1,NULL),(11,'2025-07-21 20:58:08',36.30,'Factura A','0001-00000001',1,1,NULL),(12,'2025-07-21 21:10:36',36.30,'Factura A','0001-00000001',1,1,NULL),(13,'2025-07-23 20:04:01',36.30,'Factura A','0001-00000001',1,1,NULL),(14,'2025-07-23 20:09:59',9.68,'Factura A','0001-00000001',1,1,NULL),(15,'2025-07-23 20:14:39',36.30,'Factura A','0001-00000001',1,1,NULL),(16,'2025-07-23 20:29:26',36.30,'Factura A','0001-00000001',1,1,NULL),(17,'2025-07-23 20:32:59',36.30,'Factura A','0001-00000001',1,1,NULL),(18,'2025-07-23 20:34:10',36.30,'Factura A','0001-00000001',1,1,NULL),(19,'2025-08-11 21:38:55',9.68,'TICKET','1754959135412',1,1,NULL),(20,'2025-08-12 13:33:09',69.70,'TICKET','1755016389589',1,1,NULL),(21,'2025-08-18 21:44:40',36.30,'TICKET','1755564280984',1,1,NULL),(22,'2025-08-19 19:19:20',9.68,'TICKET','1755641960562',1,1,NULL),(23,'2025-08-19 19:28:41',36.30,'TICKET','1755642521414',1,1,NULL),(24,'2025-08-19 19:30:54',36.30,'TICKET','1755642654148',1,1,NULL),(25,'2025-08-19 20:31:32',36.30,'TICKET','1755646292151',1,1,NULL),(26,'2025-08-19 20:40:09',36.30,'TICKET','1755646809021',1,1,NULL),(27,'2025-08-19 20:43:17',36.30,'TICKET','1755646997389',1,1,NULL),(28,'2025-08-19 20:50:39',36.30,'TICKET','1755647439230',1,1,NULL),(29,'2025-08-19 20:54:25',57.48,'TICKET','1755647665261',1,1,NULL),(30,'2025-08-20 22:38:20',36.30,'TICKET','1755740300666',1,1,NULL),(31,'2025-08-21 21:24:10',36.30,'TICKET','1755822250157',1,1,NULL),(32,'2025-08-21 21:25:54',36.30,'TICKET','1755822354055',1,1,NULL),(33,'2025-08-24 20:17:58',446.49,'TICKET','1756077478603',1,1,NULL),(34,'2025-08-24 20:53:22',36.30,'TICKET','1756079602436',1,1,NULL),(35,'2025-08-24 21:47:31',NULL,NULL,NULL,NULL,NULL,NULL),(36,'2025-08-24 21:47:51',NULL,NULL,NULL,NULL,NULL,NULL),(37,'2025-08-26 20:01:52',36.30,'TICKET','1756249312794',1,1,NULL),(38,'2025-08-26 20:22:56',36.30,'TICKET','1756250576444',1,1,NULL),(39,'2025-08-26 20:24:17',38.24,'TICKET','1756250656960',1,1,NULL),(40,'2025-08-26 20:28:34',290.40,'TICKET','1756250914678',1,1,NULL),(41,'2025-08-26 21:01:27',36.30,'TICKET','1756252887585',1,1,NULL),(42,'2025-08-27 20:27:19',36.30,'TICKET','1756337239608',1,1,NULL),(43,'2025-08-27 20:27:55',36.30,'TICKET','1756337275018',1,1,NULL),(44,'2025-08-27 20:39:13',34.85,'TICKET','1756337953252',1,1,NULL),(45,'2025-09-02 18:06:44',36.30,'TICKET','1756847204306',1,1,NULL),(46,'2025-09-02 18:35:40',36.30,'TICKET','1756848940056',1,1,NULL),(47,'2025-09-03 19:38:19',168.03,'TICKET','1756939098948',1,1,NULL),(48,'2025-09-04 14:43:29',36.30,'TICKET','1757007809616',1,1,1),(49,'2025-09-04 14:45:18',47.80,'TICKET','1757007918398',1,1,6),(50,'2025-09-04 14:53:07',36.30,'TICKET','1757008387563',1,1,6),(51,'2025-09-04 14:58:59',14883.00,'TICKET','1757008739053',1,1,NULL),(52,'2025-09-04 15:07:14',11.50,'TICKET','1757009234815',1,1,NULL),(53,'2025-09-04 15:12:17',36.30,'TICKET','1757009537874',1,1,6),(54,'2025-09-04 15:15:35',9.68,'TICKET','1757009735504',1,1,2),(55,'2025-09-04 15:33:57',9.68,'TICKET','1757010837803',1,1,2),(56,'2025-09-04 16:30:31',14883.00,'TICKET','1757014231471',1,12,2),(57,'2025-09-04 20:32:33',36.30,'TICKET','1757028753033',1,12,7);
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
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `venta_item`
--

LOCK TABLES `venta_item` WRITE;
/*!40000 ALTER TABLE `venta_item` DISABLE KEYS */;
INSERT INTO `venta_item` VALUES (1,1,1,1,30000.00,0.00000,6300.00000),(2,1,2,2,8000.00,500.00000,3360.00000),(3,3,1,1,30000.00,0.00000,21.00000),(4,4,1,5,30000.00,0.00000,21.00000),(5,4,2,3,8000.00,0.00000,21.00000),(6,5,1,6,30000.00,0.00000,21.00000),(7,6,1,5,30000.00,0.00000,21.00000),(8,7,3,9,9500.00,0.00000,21.00000),(9,8,1,4,30000.00,0.00000,21.00000),(10,9,1,1,30000.00,0.00000,21.00000),(12,11,1,1,30000.00,0.00000,21.00000),(13,12,1,1,30000.00,0.00000,21.00000),(14,13,1,1,30000.00,0.00000,21.00000),(15,14,2,1,8000.00,0.00000,21.00000),(16,15,1,1,30000.00,0.00000,21.00000),(17,16,1,1,30000.00,0.00000,21.00000),(18,17,1,1,30000.00,0.00000,21.00000),(19,18,1,1,30000.00,0.00000,21.00000),(20,19,2,1,8000.00,0.00000,21.00000),(21,20,2,8,8000.00,0.00000,21.00000),(22,21,1,1,30000.00,0.00000,21.00000),(23,22,2,1,8000.00,0.00000,21.00000),(24,23,1,1,30000.00,0.00000,21.00000),(25,24,1,1,30000.00,0.00000,21.00000),(26,25,1,1,30000.00,0.00000,21.00000),(27,26,1,1,30000.00,0.00000,21.00000),(28,27,1,1,30000.00,0.00000,21.00000),(29,28,1,1,30000.00,0.00000,21.00000),(30,29,1,1,30000.00,0.00000,21.00000),(31,29,3,1,9500.00,0.00000,21.00000),(32,29,2,1,8000.00,0.00000,21.00000),(33,30,1,1,30000.00,0.00000,21.00000),(34,31,1,1,30000.00,0.00000,21.00000),(35,32,1,1,30000.00,0.00000,21.00000),(36,33,1,1,30000.00,0.00000,21.00000),(37,33,3,40,9500.00,0.00000,21.00000),(38,34,1,1,30000.00,0.00000,21.00000),(39,37,1,1,30000.00,0.00000,21.00000),(40,38,1,1,30000.00,0.00000,21.00000),(41,39,1,1,30000.00,20.00000,21.00000),(42,39,3,1,9500.00,20.00000,21.00000),(43,40,1,10,30000.00,20.00000,21.00000),(44,41,1,1,30000.00,0.00000,21.00000),(45,42,1,1,30000.00,0.00000,21.00000),(46,43,1,1,30000.00,0.00000,21.00000),(47,44,1,1,30000.00,4.00000,21.00000),(48,45,1,1,30000.00,0.00000,21.00000),(49,46,1,1,30000.00,0.00000,21.00000),(50,47,1,4,30000.00,0.00000,21.00000),(51,47,7,1,123.00,0.00000,21.00000),(52,47,3,1,9500.00,0.00000,21.00000),(53,47,10,1,1231.00,0.00000,21.00000),(54,47,9,1,1.00,0.00000,21.00000),(55,47,8,1,12.00,0.00000,21.00000),(56,47,2,1,8000.00,0.00000,21.00000),(57,48,1,1,30000.00,0.00000,21.00000),(58,49,1,1,30000.00,0.00000,21.00000),(59,49,3,1,9500.00,0.00000,21.00000),(60,50,1,1,30000.00,0.00000,21.00000),(61,51,7,1,123.00,0.00000,21.00000),(62,52,3,1,9500.00,0.00000,21.00000),(63,53,1,1,30000.00,0.00000,21.00000),(64,54,2,1,8000.00,0.00000,21.00000),(65,55,2,1,8000.00,0.00000,21.00000),(66,56,7,1,123.00,0.00000,21.00000),(67,57,1,1,30000.00,0.00000,21.00000);
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
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `venta_medio_pago`
--

LOCK TABLES `venta_medio_pago` WRITE;
/*!40000 ALTER TABLE `venta_medio_pago` DISABLE KEYS */;
INSERT INTO `venta_medio_pago` VALUES (1,1,1,20000.00,NULL,NULL),(2,1,2,26500.00,NULL,NULL),(3,3,1,32.67,NULL,NULL),(4,4,2,189.49,NULL,NULL),(5,5,2,196.02,NULL,NULL),(10,11,2,36.30,NULL,'2025-07-21'),(11,12,2,36.30,'11-11111111-1','2025-07-21'),(12,13,1,36.30,NULL,'2025-07-23'),(13,14,1,9.68,NULL,'2025-07-23'),(14,15,1,36.30,NULL,'2025-07-23'),(15,16,1,36.30,NULL,'2025-07-23'),(16,17,1,36.30,NULL,'2025-07-23'),(17,18,1,36.30,NULL,'2025-07-23'),(18,19,1,9.68,NULL,'2025-08-11'),(19,20,1,69.70,NULL,'2025-08-12'),(20,21,1,36.30,NULL,'2025-08-18'),(21,22,1,9.68,NULL,'2025-08-19'),(22,23,1,36.30,NULL,'2025-08-19'),(23,24,1,36.30,NULL,'2025-08-19'),(24,25,1,36.30,NULL,'2025-08-19'),(25,26,1,36.30,NULL,'2025-08-19'),(26,27,1,36.30,NULL,'2025-08-19'),(27,28,1,36.30,NULL,'2025-08-19'),(28,29,3,57.48,NULL,'2025-08-19'),(29,30,1,36.30,NULL,'2025-08-20'),(30,31,1,36.30,NULL,'2025-08-21'),(31,32,1,36.30,NULL,'2025-08-21'),(32,33,1,446.49,NULL,'2025-08-24'),(33,34,1,36.30,NULL,'2025-08-24'),(34,37,1,36.30,NULL,'2025-08-26'),(35,38,1,36.30,NULL,'2025-08-26'),(36,39,1,38.24,NULL,'2025-08-26'),(37,40,3,290.40,NULL,'2025-08-26'),(38,41,1,36.30,NULL,'2025-08-26'),(39,42,1,36.30,NULL,'2025-08-27'),(40,43,1,36.30,NULL,'2025-08-27'),(41,44,1,34.85,NULL,'2025-08-27'),(42,45,1,36.30,NULL,'2025-09-02'),(43,46,1,36.30,NULL,'2025-09-02'),(44,47,1,168.03,NULL,'2025-09-03'),(45,48,1,36.30,NULL,'2025-09-04'),(46,49,1,47.80,NULL,'2025-09-04'),(47,50,1,36.30,NULL,'2025-09-04'),(48,51,1,14883.00,NULL,'2025-09-04'),(49,52,1,11.50,NULL,'2025-09-04'),(50,53,1,36.30,NULL,'2025-09-04'),(51,54,1,9.68,NULL,'2025-09-04'),(52,55,1,9.68,NULL,'2025-09-04'),(53,56,1,14883.00,NULL,'2025-09-04'),(54,57,1,36.30,NULL,'2025-09-04');
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

-- Dump completed on 2025-09-04 20:42:27
