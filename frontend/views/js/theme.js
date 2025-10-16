document.addEventListener("DOMContentLoaded", () => {
  const btnTema = document.getElementById("btnTema"); // fallback si existe en alguna vista legacy
  const switchTema = document.getElementById("switchTema");
  const root = document.documentElement;
  // No se usan iconos/labels visibles, solo el switch.

  function aplicarTema(tema) {
    const esOscuro = tema === "oscuro"; // valores esperados: "oscuro" | "claro"
    root.setAttribute("data-bs-theme", esOscuro ? "dark" : "light");
    // Asegurar que el body sea visible cuando se aplica el tema
    if (document.body && getComputedStyle(document.body).display === 'none') {
      document.body.style.display = 'block';
    }

    // Actualizar UI del control (solo switch y botón legacy si existe)
    if (switchTema) {
      switchTema.checked = esOscuro; // checked = oscuro
    }

    if (btnTema) {
      // Mantener compatibilidad con vistas antiguas que aún tengan botón
      btnTema.textContent = esOscuro ? 'Claro' : 'Oscuro';
      btnTema.classList.remove("btn-outline-light","btn-outline-warning","btn-light","btn-warning");
      btnTema.classList.add(esOscuro ? "btn-warning" : "btn-light");
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
  if (switchTema) {
    switchTema.addEventListener("change", (e) => {
      const nuevo = e.target.checked ? "oscuro" : "claro";
      localStorage.setItem("tema", nuevo);
      aplicarTema(nuevo);
    });
  }

  if (btnTema) {
    btnTema.addEventListener("click", () => {
      const actual = root.getAttribute("data-bs-theme");
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
