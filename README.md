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