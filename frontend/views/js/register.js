document
  .getElementById("registroForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const contrasena = document.getElementById("contrasena").value;
    const rol = document.getElementById("rol").value;
    const alerta = document.getElementById("registro-alert");

    // Validación rápida en frontend
    if (!nombre || !email || !contrasena || !rol) {
      alerta.className = "alert alert-danger";
      alerta.textContent = "Todos los campos son obligatorios";
      alerta.classList.remove("d-none");
      return;
    }

    try {
      // Verificar disponibilidad del email antes de registrar
      const checkRes = await fetch(
        `/Gestion-stock-tienda-motos/app/check-email?email=${encodeURIComponent(
          email
        )}`
      );
      const checkData = await checkRes.json();

      if (checkData.existe) {
        alerta.className = "alert alert-danger";
        alerta.textContent = "El email ya está registrado";
        alerta.classList.remove("d-none");
        return;
      }

      // Si el email está disponible, proceder con registro
      const res = await fetch(
        "/Gestion-stock-tienda-motos/app/registrar_usuario",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, email, contrasena, rol }),
        }
      );

      const data = await res.json();

      if (res.ok && data.mensaje) {
        alerta.className = "alert alert-success";
        alerta.textContent = "Registro exitoso. Redirigiendo...";
        alerta.classList.remove("d-none");

        setTimeout(() => {
          window.location.href =
            "login.html?registro=exitoso&email=" + encodeURIComponent(email);
        }, 2000);
      } else {
        throw new Error(data.error || "Error en el registro");
      }
    } catch (err) {
      alerta.className = "alert alert-danger";
      alerta.textContent = err.message;
      alerta.classList.remove("d-none");
    }
  });
