  document.addEventListener("DOMContentLoaded", () => {
    const btnTema = document.getElementById("btnTema");
    const root = document.documentElement;

    function aplicarTema(tema) {
      if (tema === "oscuro") {
        root.setAttribute("data-bs-theme", "dark");
        btnTema.textContent = "☀️ Claro";
        btnTema.classList.replace("btn-outline-light", "btn-outline-warning");    
      } else {
        root.setAttribute("data-bs-theme", "light");
        btnTema.textContent = "🌙 Oscuro";
        btnTema.classList.replace("btn-outline-warning", "btn-outline-light");
      }
    }

    // Cargar preferencia previa
    aplicarTema(localStorage.getItem("tema") || "dark");

    // Alternar al hacer clic
    btnTema.addEventListener("click", () => {
      const nuevo = root.getAttribute("data-bs-theme") === "dark" ? "claro" : "oscuro";
      localStorage.setItem("tema", nuevo);
      aplicarTema(nuevo);
    });
  });
