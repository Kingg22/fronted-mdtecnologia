import { loadBreadcrumb } from "./main.js";
document.addEventListener("DOMContentLoaded", () => {
    loadBreadcrumb([
        { name: "Inicio", href: "Home.html" },
        { name: "Productos", href: "Productos.html" },
        { name: "Agregar", href: null },
    ]);
});
