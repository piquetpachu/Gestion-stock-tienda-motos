<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Administrar Rubros</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
</head>
<body>
<div class="container mt-5">
    <h2>Administrar Rubros</h2>
    <!-- Formulario para añadir/editar rubro -->
    <form id="rubroForm" class="mb-4">
        <input type="hidden" id="rubroId">
        <div class="mb-3">
            <label for="nombreRubro" class="form-label">Nombre del Rubro</label>
            <input type="text" class="form-control" id="nombreRubro" required>
        </div>
        <button type="submit" class="btn btn-primary" id="btnGuardar">Añadir Rubro</button>
        <button type="button" class="btn btn-secondary d-none" id="btnCancelar">Cancelar</button>
    </form>

    <!-- Tabla de rubros -->
    <table class="table table-bordered" id="tablaRubros">
        <thead>
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            <!-- Rubros se mostrarán aquí -->
        </tbody>
    </table>
</div>

<script>
let rubros = [];
let editando = false;

// Mostrar rubros en la tabla
function mostrarRubros() {
    const tbody = document.querySelector("#tablaRubros tbody");
    tbody.innerHTML = "";
    rubros.forEach((rubro, idx) => {
        tbody.innerHTML += `
            <tr>
                <td>${rubro.id}</td>
                <td>${rubro.nombre}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editarRubro(${idx})">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="borrarRubro(${idx})">Borrar</button>
                </td>
            </tr>
        `;
    });
}

// Añadir o editar rubro
document.getElementById("rubroForm").onsubmit = function(e) {
    e.preventDefault();
    const nombre = document.getElementById("nombreRubro").value.trim();
    if (!nombre) return;
    if (editando) {
        const idx = document.getElementById("rubroId").value;
        rubros[idx].nombre = nombre;
        editando = false;
        document.getElementById("btnGuardar").textContent = "Añadir Rubro";
        document.getElementById("btnCancelar").classList.add("d-none");
    } else {
        rubros.push({ id: rubros.length + 1, nombre });
    }
    document.getElementById("rubroForm").reset();
    mostrarRubros();
};

// Editar rubro
window.editarRubro = function(idx) {
    document.getElementById("rubroId").value = idx;
    document.getElementById("nombreRubro").value = rubros[idx].nombre;
    editando = true;
    document.getElementById("btnGuardar").textContent = "Guardar Cambios";
    document.getElementById("btnCancelar").classList.remove("d-none");
};

// Borrar rubro
window.borrarRubro = function(idx) {
    if (confirm("¿Seguro que desea borrar este rubro?")) {
        rubros.splice(idx, 1);
        mostrarRubros();
    }
};

// Cancelar edición
document.getElementById("btnCancelar").onclick = function() {
    editando = false;
    document.getElementById("rubroForm").reset();
    document.getElementById("btnGuardar").textContent = "Añadir Rubro";
    document.getElementById("btnCancelar").classList.add("d-none");
};

mostrarRubros();
</script>
</body>
</html>