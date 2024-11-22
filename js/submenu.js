import { BASE_URL } from "./utils.js";
document.addEventListener("DOMContentLoaded", async function () {
    const categoriesContainer = document.querySelector("#navbar-vertical .navbar-nav");
  
    async function cargarCategorias() {
      try {
        const response = await fetch("${BASE_URL}/categories");
        const categories = await response.json();
  
        if (categories && Array.isArray(categories)) {
          categoriesContainer.innerHTML = "";
          categories.forEach((category) => {
            const categoryLink = document.createElement("a");
            categoryLink.href = `Productos.html?category=${encodeURIComponent(category)}`;
            categoryLink.className = "nav-item nav-link";
            categoryLink.textContent = category.charAt(0).toUpperCase() + category.slice(1); // Capitaliza el nombre
            categoriesContainer.appendChild(categoryLink);
          });
        } else {
          console.error("No se encontraron categorías.");
        }
      } catch (error) {
        console.error("Error al cargar las categorías:", error);
      }
    }
    cargarCategorias();
  });