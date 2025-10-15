document.addEventListener("DOMContentLoaded", () => {
  const btnTema = document.getElementById("btnTema");
  const root = document.documentElement;

  function aplicarTema(tema) {
    const esOscuro = tema === "oscuro"; // valores esperados: "oscuro" | "claro"
    root.setAttribute("data-bs-theme", esOscuro ? "dark" : "light");
    // Asegurar que el body sea visible cuando se aplica el tema
    if (document.body && getComputedStyle(document.body).display === 'none') {
      document.body.style.display = 'block';
    }

    // Si no existe el botón (por ejemplo en login), no intentar modificarlo
    if (!btnTema) return;

    if (esOscuro) {
      btnTema.textContent = "☀️ Claro";
      btnTema.classList.replace("btn-outline-light", "btn-outline-warning");
    } else {
      btnTema.textContent = "🌙 Oscuro";
      btnTema.classList.replace("btn-outline-warning", "btn-outline-light");
    }
  }

  // Determinar tema inicial: 1) localStorage, 2) atributo en <html>, 3) por defecto "claro"
  const attrTema = root.getAttribute("data-bs-theme"); // "dark" | "light" | null
  const preferencia = localStorage.getItem("tema"); // "oscuro" | "claro" | null
  const temaInicial = preferencia
    ? preferencia
    : (attrTema === "dark" ? "oscuro" : "claro");
  aplicarTema(temaInicial);

  // Alternar al hacer clic (solo si el botón existe en la vista actual)
  if (btnTema) {
    btnTema.addEventListener("click", () => {
      const actual = root.getAttribute("data-bs-theme"); // "dark" | "light"
      const nuevo = actual === "dark" ? "claro" : "oscuro";
      localStorage.setItem("tema", nuevo);
      aplicarTema(nuevo);
    });
  }

  // Asegurar que el body sea visible (algunos estilos globales lo ocultan inicialmente)
  if (document.body && getComputedStyle(document.body).display === 'none') {
    document.body.style.display = 'block';
  }
});
