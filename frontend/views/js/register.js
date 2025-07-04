    document.getElementById("registroForm").addEventListener("submit", async function (e) {
      e.preventDefault();
      const nombre = document.getElementById("nombre").value;
      const email = document.getElementById("email").value;
      const contrasena = document.getElementById("contrasena").value;
      const rol = document.getElementById("rol").value;
      const alerta = document.getElementById("registro-alert");

      try {
        const res = await fetch("/Gestion-stock-tienda-motos/app/registrar_usuario", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, email, contrasena, rol })
        });

        const texto = await res.text();
        const data = JSON.parse(texto);

        if (data.mensaje) {
          alerta.className = "alert alert-success";
          alerta.textContent = data.mensaje;
          alerta.classList.remove("d-none");
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