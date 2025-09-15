# Contexto General de la Aplicación

## Nombre del Proyecto
Gestion-stock-tienda-motos

## Descripción
Sistema web para la gestión de stock, ventas, compras y administración de una tienda de motos. Permite controlar productos, clientes, proveedores, movimientos de stock, estadísticas, usuarios y más.

## Estructura de Carpetas
- **app/**: Lógica principal de la aplicación (MVC)
  - **controllers/**: Controladores para cada entidad (clientes, productos, ventas, compras, etc.)
  - **helpers/**: Funciones auxiliares (CSRF, middlewares, parseo de rutas)
  - **models/**: Modelos de datos (ORM manual)
  - **routes/**: Definición de rutas y endpoints
  - **index.php**: Entrada principal de la app
- **backups/**: Scripts y archivos de respaldo de la base de datos
- **config/**: Configuración de entorno, base de datos y parámetros globales
- **frontend/**: Vistas y recursos del cliente
  - **views/**: Archivos HTML, CSS y JS para la interfaz
- **public/**: Archivos públicos (imágenes, textos)
- **storage/**: Archivos de almacenamiento interno

## Tecnologías Utilizadas
- **Backend**: PHP (MVC manual)
- **Frontend**: HTML, CSS, JavaScript
- **Base de datos**: MySQL (archivos .sql de respaldo incluidos)
- **Servidor**: XAMPP (Apache + MySQL)

## Endpoints Principales (según `app/routes/api.php`)
- `/clientes` (GET, POST, PUT, DELETE): Gestión de clientes
- `/productos` (GET, POST, PUT, DELETE): Gestión de productos
- `/proveedores` (GET, POST, PUT, DELETE): Gestión de proveedores
- `/compras` (GET, POST, PUT, DELETE): Gestión de compras
- `/ventas` (GET, POST, PUT, DELETE): Gestión de ventas
- `/estadisticas` (GET): Consultas de estadísticas
- `/usuarios` (GET, POST, PUT, DELETE): Gestión de usuarios
- `/rubros` (GET, POST, PUT, DELETE): Gestión de rubros
- `/movimiento-stock` (GET, POST): Movimientos de stock
- `/medio-pago` (GET, POST): Medios de pago

## Seguridad
- Middleware para protección de rutas
- CSRF en formularios
- Autenticación de usuarios

## Archivos Importantes
- `index.php`: Entrada principal
- `app/index.php`: Bootstrap de la app
- `config/database.php`: Configuración de la base de datos
- `frontend/views/login.html`: Login de usuarios
- `tienda_motos.sql`: Estructura y datos de la base de datos

## Respaldo y Recuperación
- Carpeta `backups/` con scripts y dumps SQL

## Documentación
- `README.md`: Descripción general
- `descripcion_de_carpetas.md`: Detalle de carpetas
- `endpoints.md`: Listado de endpoints
- `estructura_de_carpetass.md`: Estructura de carpetas

---
Este archivo resume la estructura, tecnologías, endpoints y aspectos clave de la aplicación para facilitar el desarrollo y mantenimiento.
