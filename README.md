# Documentación del Sistema de Gestión de Stock para Tienda de Motos

## Descripción General

Esta aplicación web permite gestionar el inventario, ventas, compras, clientes, proveedores y usuarios de una tienda de motos. Está desarrollada en PHP para el backend y JavaScript/HTML/CSS para el frontend. Utiliza una arquitectura modular y está pensada para ser utilizada por administradores y vendedores.

---

## Estructura de Carpetas

- **app/**: Lógica principal del backend (controladores, modelos, helpers, rutas).
- **config/**: Archivos de configuración y conexión a la base de datos.
- **frontend/**: Archivos del frontend (vistas HTML, JS, CSS).
- **public/**: Archivos públicos (imágenes, recursos estáticos).
- **storage/**: Archivos de almacenamiento temporal o persistente.

---

## Principales Funcionalidades

### 1. Gestión de Productos
- Alta, baja y modificación de productos.
- Visualización de stock, precios, descripción y código de barras.
- Control de stock mínimo y alertas.

### 2. Gestión de Clientes
- Registro, edición y eliminación de clientes.
- Búsqueda y filtrado por nombre, email, DNI, etc.

### 3. Gestión de Proveedores
- Registro y administración de proveedores.

### 4. Compras y Ventas
- Registro de compras y ventas con detalle de ítems y medios de pago.
- Visualización de historial y estadísticas.

### 5. Usuarios y Roles
- Sistema de autenticación y autorización.
- Roles: administrador y vendedor.
- Restricción de funciones según el rol (por ejemplo, solo el admin puede editar/eliminar productos).

### 6. Estadísticas
- Panel de estadísticas con gráficos de ventas, productos más vendidos, ganancias diarias/mensuales/anuales.

---

## Seguridad

- Validación de acceso en el frontend: páginas protegidas redirigen al login si el usuario no está autenticado.
- Restricción de botones y funciones según el rol del usuario.
- Validación en el backend para evitar accesos no autorizados.

---

## Flujo de Funcionamiento

1. **Login/Registro**: El usuario accede mediante login. Si no está autenticado, no puede acceder a páginas protegidas.
2. **Navegación**: El usuario navega por el dashboard, productos, ventas, clientes, etc.
3. **Acciones**: Según el rol, puede realizar acciones como agregar, editar o eliminar registros.
4. **Visualización**: El sistema muestra información relevante y estadísticas en tiempo real.
5. **Seguridad**: El frontend y backend validan el acceso y las acciones permitidas.

---

## Tecnologías Utilizadas

- **Backend**: PHP (MVC básico), MySQL (base de datos).
- **Frontend**: HTML, CSS (Bootstrap), JavaScript.
- **AJAX**: Para comunicación asíncrona entre frontend y backend.
- **Gráficos**: Chart.js para visualización de estadísticas.

---

## Cómo Extender o Modificar

- Para agregar nuevos roles, modifica la lógica de autorización en el frontend y backend.
- Para agregar nuevas entidades (por ejemplo, repuestos), crea nuevos modelos, controladores y vistas.
- Para cambiar la configuración de la API, edita el archivo `config.js` en el frontend y los archivos de configuración en el backend.

---

## Recomendaciones

- Mantén la validación de roles tanto en el frontend como en el backend.
- Realiza backups periódicos de la base de datos.
- Actualiza las dependencias y librerías para mantener la seguridad.

---
# 👥 Guía de Colaboración con Git para el Proyecto Tienda de Motos

Este documento describe el flujo de trabajo que usamos en el equipo para desarrollar de forma ordenada y evitar conflictos de código.

---

## 🌿 Estructura de ramas

- **main** → Solo contiene código estable y funcional. Rama que se subirá al hosting.
- **main-dev** → Rama de desarrollo general, donde se integran las funcionalidades del equipo.
- **ramas de tarea** → Cada desarrollador crea una rama por tarea específica. Ejemplos:
  - `crud-motos`
  - `api-ventas`
  - `registro-usuarios`

---

## 🧪 Flujo paso a paso

### 1. Actualizar tu repositorio local

Antes de empezar una tarea, **actualizá tu copia local** del proyecto para tener el código más reciente del equipo:
```bash
git checkout main-dev
git pull origin main-dev
```
🔎 ¿Qué hace git pull origin main-dev?

Este comando:

Descarga los últimos cambios que haya hecho otro compañero en la rama main-dev.

Los fusiona automáticamente en tu copia local.

📌 Es importante hacerlo siempre antes de crear una nueva rama o seguir trabajando en una que quedó pendiente.

2. Crear una nueva rama de trabajo
```bash
git checkout -b nombre-de-la-rama
```
Ejemplo:
```bash
git checkout -b crud-motos
```
3. Trabajar en tu funcionalidad
Agregá/modificá solo lo relacionado con tu tarea.

Evitá mezclar cambios innecesarios.

4. Guardar tus cambios
```bash
git add .
git commit -m "feat: agregar formulario de motos"
```
5. Subir tu rama a GitHub
```bash
git push origin nombre-de-la-rama
```
Ejemplo:

```bash
git push origin crud-motos
```
6. Crear un Pull Request (PR)
Entrá al repositorio en GitHub.

GitHub mostrará un botón:
👉 Compare & pull request

Asegurate de que diga:

- base: main-dev

- compare: tu-rama

Escribí un título y descripción clara.

Hacé clic en Create pull request.

📌 Nota: Si la tarea está incompleta, podés marcar la PR como Draft.

7. Merge y limpieza
Una vez aprobada la PR:

🔀 Merge:
Hacé clic en el botón Merge pull request desde GitHub.

🧹 Borrar la rama:
Desde GitHub:

GitHub te ofrecerá un botón para Delete branch.

Desde tu computadora:
```bash
git checkout main-dev
git branch -d nombre-de-la-rama
git push origin --delete nombre-de-la-rama
```
🧠 Buenas prácticas
- Usá git pull origin main-dev antes de empezar o continuar una tarea.

- Escribí mensajes de commit claros 

- Probá tu código antes de subirlo.

- Si tenés dudas, consultá en el grupo antes de mergear.

💬 Ejemplo de Pull Request

Título: CRUD de motos básico

Descripción:

Se creó el formulario para agregar motos.

Se implementó listado y edición.

Falta validación de campos (se hará en otra tarea).

## 📘 Glosario rápido de comandos Git

| Comando                                 | Descripción                                                                 |
|-----------------------------------------|-----------------------------------------------------------------------------|
| `git pull origin main-dev`              | Descarga los últimos cambios de la rama `main-dev` y los fusiona localmente |
| `git checkout -b nombre-rama`           | Crea una nueva rama y cambia a ella inmediatamente                          |
| `git add .`                             | Agrega todos los archivos modificados para el próximo commit               |
| `git commit -m "mensaje"`               | Guarda los cambios con un mensaje descriptivo                              |
| `git push origin nombre-rama`           | Sube la rama y tus cambios a GitHub                                        |
| `git branch`                            | Muestra la lista de ramas locales                                           |
| `git branch -d nombre-rama`             | Elimina una rama local (solo si ya fue fusionada)                          |
| `git push origin --delete nombre-rama`  | Elimina una rama remota de GitHub                                          |
| `git checkout main-dev`                 | Cambia a la rama `main-dev`                                                |
| `git status`                            | Muestra el estado de los archivos (modificados, sin agregar, etc.)         |

¡Gracias por contribuir! 🚀