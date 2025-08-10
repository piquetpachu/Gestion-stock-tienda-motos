
## 📄 Archivos Relevantes

- **Base de datos:**  
  - [tienda_motos.sql](tienda_motos.sql): Estructura y datos de prueba de la base de datos.

- **Backend (API y lógica):**  
  - [app/routes/api.php](app/routes/api.php): Enrutador principal de la API REST.
  - [app/controllers/](app/controllers/): Controladores para cada recurso (productos, ventas, usuarios, etc).
  - [app/models/](app/models/): Modelos para acceso y manipulación de datos en la base.
  - [app/helpers/](app/helpers/): Funciones auxiliares (autenticación, CSRF, parsing de rutas).
  - [config/database.php](config/database.php): Conexión a la base de datos.
  - [config/cargar_env.php](config/cargar_env.php): Carga de variables de entorno.

- **Frontend (Vistas y scripts):**  
  - [frontend/views/html/](frontend/views/html/): Vistas HTML para login, registro, dashboard, productos, ventas.
  - [frontend/views/js/](frontend/views/js/): Scripts JS para interactividad (productos.js, ventas.js, login.js, etc).

- **Otros:**  
  - [.env](.env): Variables de entorno (no debe subirse a producción).
  - [.gitignore](.gitignore): Archivos ignorados por Git.
  - [README.md](README.md): Guía de colaboración y flujo de trabajo con Git.
  - [estructura_de_carpetas.md](estructura_de_carpetas.md): Explicación detallada de la estructura del proyecto.

## 📝 Descripción General

- **Arquitectura:**  
  - Basada en MVC (Modelo-Vista-Controlador) + API REST.
  - Backend en PHP, frontend con HTML, Bootstrap y JavaScript.
  - Separación clara entre lógica de negocio (app/), configuración (config/), vistas (frontend/views/) y recursos públicos (public/).

- **Funcionalidades principales:**  
  - Gestión de productos, ventas, compras, clientes, usuarios, rubros, medios de pago, movimientos de stock.
  - Autenticación y autorización por roles (admin, vendedor).
  - API REST para operaciones CRUD y consultas.
  - Interfaz web amigable para administración.

- **Colaboración:**  
  - Uso de ramas en Git para desarrollo ordenado.
  - Documentación y ejemplos de endpoints en [endpoints.md](endpoints.md).

---

> Para más detalles sobre cada carpeta y archivo, consulta [estructura_de_carpetas.md](estructura_de_carpetas.md).