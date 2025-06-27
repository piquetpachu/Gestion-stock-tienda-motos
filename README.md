# 📁 Estructura del Proyecto PHP (MVC + API)

Este proyecto está organizado siguiendo una estructura **MVC** (Modelo-Vista-Controlador) combinada con rutas para una **API REST**. A continuación, se detalla el propósito de cada carpeta y archivo:

---

## 🧠 `app/`

Contiene toda la lógica de negocio, organización del código y configuración principal del sistema.

### 📁 `controllers/`
- **productosController.php**: Controlador responsable de manejar las solicitudes relacionadas con productos. Recibe las peticiones desde las rutas y se comunica con los modelos para devolver resultados.

### 📁 `models/`
- **productos.php**: Modelo de productos. Contiene funciones para interactuar con la base de datos (obtener, insertar, actualizar, eliminar productos).
- **usuario.php**: Modelo de usuarios. Similar al de productos pero para manejar datos de usuarios.

### 📁 `routes/`
- **api.php**: Define las rutas disponibles para consumir la API (por ejemplo: `/api/productos`, `/api/usuarios`). Conecta las URLs con sus respectivos controladores.
- **index.php**: Punto de entrada principal si se accede por web tradicional (por ejemplo, para servir vistas o redireccionar).
- **.htaccess**: Archivo de configuración de Apache para redirigir todas las solicitudes a `index.php` (routing amigable con URLs limpias).

---

## ⚙️ `config/`

Contiene archivos de configuración global del sistema.

- **config.php**: Configuraciones generales (constantes, rutas, opciones de sistema).
- **database.php**: Configura la conexión con la base de datos.
- **cargar_env.php**: Carga las variables de entorno definidas en el archivo `.env`.

---

## 🖼️ `frontend/views/`

Agrupa todos los recursos estáticos y vistas del frontend.

### 📁 `css/`
- Archivos de estilo CSS del frontend.

### 📁 `html/`
- Archivos `.html` que representan la estructura visual de la interfaz.

### 📁 `js/`
- Scripts JavaScript que brindan interactividad al sitio.

---

## 🌐 `public/`

Esta carpeta es la única que debe estar accesible desde el navegador (document root).

- 📁 `img/`: Imágenes públicas del sitio.
- 📝 `cosas.txt`: Ejemplo de archivo público. No sensible.

---

## 📦 `storage/`

Contenedor para archivos generados o subidos por el sistema. Puede incluir logs, archivos temporales, uploads, etc.

- 📝 `cosas.txt`: Archivo de ejemplo, podría ser contenido generado por el sistema.

---

## 🔐 Archivos raíz

- **.env**: Variables de entorno (credenciales, puertos, etc.). Nunca debe subirse a producción pública.
- **.gitignore**: Define qué archivos deben ser ignorados por Git (por ejemplo, `.env`, `storage/`, etc.).
- **env.txt**: Posiblemente un backup o ejemplo del `.env`.

---

## 🛠 Cómo trabajar con esta estructura

### 1. Configura el entorno
- Copia `env.txt` como `.env` y coloca tus credenciales y configuraciones reales.
- Asegúrate de que Apache y PHP estén configurados para apuntar a la carpeta `public/`.

### 2. Define rutas en `routes/api.php`
- Cada ruta debe apuntar a una función en un controlador.

### 3. Controladores (`controllers/`)
- Contienen la lógica para procesar solicitudes y respuestas.

### 4. Modelos (`models/`)
- Realizan consultas y operaciones sobre la base de datos.

### 5. Frontend (`frontend/views/`)
- Construye la interfaz de usuario usando HTML, CSS y JS.

### 6. Public
- Solo esta carpeta se expone directamente al navegador.

### 7. Storage
- Ideal para manejar archivos temporales, logs, o archivos subidos.

---

✅ **Recomendación**: Mantén el código organizado, aplica buenas prácticas de seguridad y estructura tus rutas de forma clara y coherente.
