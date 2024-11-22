import { BASE_URL, eventManager } from "./utils.js";

const categoriesContainer = document.getElementById("navbar-categorias");
const typeFilterContainer = document.getElementById("type-filter-container");

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
      renderCategoriasNavBar(categories);
      if (typeFilterContainer != null)
        renderFiltrosProducto(categories);
    })
    .catch((error) => {
      console.error("Error al cargar las categorías:", error);
    });
});

const renderCategoriasNavBar = function (categories) {
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
}

const renderFiltrosProducto = function (categories) {
  if (categories.categorias?.length > 0) {
    const radioDivAll = document.createElement("div");
    radioDivAll.className = "custom-control custom-radio";

    const radioInputAll = document.createElement("input");
    radioInputAll.type = "radio";
    radioInputAll.className = "custom-control-input";
    radioInputAll.name = "type-filter";
    radioInputAll.value = "";
    radioInputAll.id = "type-all";
    radioInputAll.checked = true;

    const radioLabelAll = document.createElement("label");
    radioLabelAll.className = "custom-control-label";
    radioLabelAll.setAttribute("for", "type-all");
    radioLabelAll.textContent = "Todos"

    radioDivAll.appendChild(radioInputAll);
    radioDivAll.appendChild(radioLabelAll);
    typeFilterContainer.appendChild(radioDivAll);

    categories.categorias.forEach((category) => {
      // Crear y agregar filtros por tipo
      const radioDiv = document.createElement("div");
      radioDiv.className = "custom-control custom-radio";

      const radioInput = document.createElement("input");
      radioInput.type = "radio";
      radioInput.className = "custom-control-input";
      radioInput.name = "type-filter";
      radioInput.value = category.id;
      radioInput.id = `type-${category.nombre.toLowerCase()}`;
      radioInput.setAttribute('data-category-id', category.id);

      const radioLabel = document.createElement("label");
      radioLabel.className = "custom-control-label";
      radioLabel.setAttribute("for", `type-${category.nombre.toLowerCase()}`);
      radioLabel.textContent = category.nombre;

      radioDiv.appendChild(radioInput);
      radioDiv.appendChild(radioLabel);
      typeFilterContainer.appendChild(radioDiv);
    });
  } else {
    alert("No se encontraron categorías.");
  }
}