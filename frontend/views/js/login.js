    document.getElementById("loginForm").addEventListener("submit", async function (e) {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const contrasena = document.getElementById("contrasena").value;
      const alerta = document.getElementById("login-alert");

      try {
        const res = await fetch("/Gestion-stock-tienda-motos/app/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, contrasena })
        });

        const texto = await res.text();
        const data = JSON.parse(texto);

        if (data.mensaje) {
          alerta.className = "alert alert-success";
          alerta.textContent = data.mensaje;
          alerta.classList.remove("d-none");
          location.href="dashboard.html"
          // Redirigir o guardar datos en localStorage si hace falta
        } else {
          alerta.className = "alert alert-danger";
          alerta.textContent = data.error || "Error inesperado";
          alerta.classList.remove("d-none");
        }
      } catch (err) {
        alerta.className = "alert alert-danger";
        alerta.textContent = "No se pudo conectar al servidor.";
        alerta.classList.remove("d-none");
      }
    });