import { BASE_URL, eventManager } from "./utils.js";

const categoriesContainer = document.getElementById("navbar-categorias");

document.addEventListener('DOMContentLoaded', async function () {
  // --- Menú Desplegable ---
  const dropdownButton = document.querySelector('.btn[data-toggle="collapse"]');
  const dropdownMenu = document.querySelector('#navbar-vertical');

  if (dropdownButton && dropdownMenu) {
    dropdownButton.addEventListener('click', function (event) {
      event.preventDefault();
      dropdownMenu.classList.toggle('show');
    });

    document.addEventListener('click', function (event) {
      if (!dropdownButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
        dropdownMenu.classList.remove('show');
      }
    });
  }

  await cargarCategorias();
});

const cargarCategorias = eventManager(async () => {
  fetch(`${BASE_URL}/Categorias`)
    .then((response) => response.json())
    .then((categories) => {
      if (categories.categorias?.length > 0) {
        categoriesContainer.innerHTML = "";
        categories.categorias.forEach((category) => {
          const categoryLink = document.createElement("a");
          // categoryLink.href = `Productos.html?category=${encodeURIComponent(category)}`;
          categoryLink.className = "nav-item nav-link";
          categoryLink.textContent = category.nombre;
          categoriesContainer.appendChild(categoryLink);
        });
      } else {
        alert("No se encontraron categorías.");
      }
    })
    .catch((error) => {
      console.error("Error al cargar las categorías:", error);
    });
});

