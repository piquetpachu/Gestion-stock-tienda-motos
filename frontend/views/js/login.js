// ✅ Verificar si el usuario ya está logueado al cargar la página
window.addEventListener("DOMContentLoaded", async function () {
  try {
    const res = await fetch("/Gestion-stock-tienda-motos/app/usuario-info", {
      credentials: "same-origin"
    });
    if (res.ok) {
      const userData = await res.json();
      console.log("Usuario ya logueado:", userData);

      if (userData.id) {
        // Guardar en localStorage
        localStorage.setItem("id_usuario", userData.id);
        localStorage.setItem("rol_usuario", userData.rol);
        localStorage.setItem("nombre_usuario", userData.nombre);

        // Redirigir según rol
        if (userData.rol === "admin") {
          location.href = "../html/dashboard.php";
        } else {
          location.href = "dashboard.php";
        }
      }
    }
  } catch (err) {
    // No logueado → no hacer nada
  }
});

// ✅ Login al enviar el formulario
document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const contrasena = document.getElementById("contrasena").value;
  const alerta = document.getElementById("login-alert");

  try {
    const res = await fetch("/Gestion-stock-tienda-motos/app/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, contrasena }),
      credentials: "same-origin"
    });

    const texto = await res.text();
    const data = JSON.parse(texto);

    if (data.mensaje) {
      alerta.className = "alert alert-success";
      alerta.textContent = data.mensaje;
      alerta.classList.remove("d-none");

      // ✅ Obtener datos del usuario logueado
      const obtenerUsuario = async () => {
        const res = await fetch("/Gestion-stock-tienda-motos/app/usuario-info", {
          credentials: "same-origin"
        });
        const userData = await res.json();
        console.log("Datos del usuario:", userData);

        if (userData.id) {
          // Guardar en localStorage
          localStorage.setItem("id_usuario", userData.id);
          localStorage.setItem("rol_usuario", userData.rol);
          localStorage.setItem("nombre_usuario", userData.nombre);

          // Redirigir según rol
          if (userData.rol === "admin") {
            location.href = "../html/dashboard.php";
          } else {
            location.href = "dashboard.php";
          }
        } else {
          alerta.className = "alert alert-danger";
          alerta.textContent = "No se pudo obtener la información del usuario.";
          alerta.classList.remove("d-none");
        }
      };

      obtenerUsuario();
    } else if (data.error) {
      alerta.className = "alert alert-danger";
      alerta.textContent = data.error;
      alerta.classList.remove("d-none");
    }
  } catch (err) {
    alerta.className = "alert alert-danger";
    alerta.textContent = "No se pudo conectar al servidor.";
    alerta.classList.remove("d-none");
    console.error(err);
  }
});
