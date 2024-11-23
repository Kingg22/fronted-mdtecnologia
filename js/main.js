import { BASE_URL, eventManager } from "./utils.js";

const categoriesContainer = document.getElementById("navbar-categorias");
const typeFilterContainer = document.getElementById("type-filter-container");
const categoriesHomeContainer = document.getElementById('categorias-bonitas-container');
export const cart = JSON.parse(localStorage.getItem("cart") || "[]");

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

  // evento de mostrar / ocultar contraseña
  document.querySelectorAll(".toggle-password").forEach((img) => {
    img.addEventListener("click", function () {
      const target = document.getElementById(this.dataset.target);
      if (target.type === "password") {
        target.type = "text";
      } else {
        target.type = "password";
      }
    });
  });

  document.getElementById("clearButton").addEventListener('click', () => {
    const form = document.getElementById('searchForm');
    if (form) {
      form.submit();
      form.reset();
    }
  });

  await cargarCategorias();
  cartTotal(cart);
});

const cargarCategorias = eventManager(async () => {
  fetch(`${BASE_URL}/Categorias`)
    .then((response) => response.json())
    .then((categories) => {
      renderCategoriasNavBar(categories);
      if (typeFilterContainer != null)
        renderFiltrosProducto(categories);
      if (categoriesHomeContainer != null)
        renderCategoriasHome(categories);
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
      categoryLink.href = `Productos.html?category=${category.id}`;
      categoryLink.className = "nav-item nav-link";
      categoryLink.textContent = category.nombre;
      categoriesContainer.appendChild(categoryLink);
    });
  } else {
    console.error("No se encontraron categorías.");
  }
}

const renderCategoriasHome = function (categories) {
  categoriesHomeContainer.innerHTML = "";

  categories.categorias.forEach((category) => {
    const categoryDiv = document.createElement("div");
    categoryDiv.className = "col-lg-3 col-md-4 col-sm-6 pb-1";

    const categoryLink = document.createElement("a");
    categoryLink.className = "text-decoration-none";
    categoryLink.href = `Productos.html?category=${category.id}`;

    // contenedor para la imagen
    const catItemDiv = document.createElement("div");
    catItemDiv.className = "cat-item img-zoom d-flex align-items-center mb-4";

    const imgDiv = document.createElement("div");
    imgDiv.className = "overflow-hidden";
    imgDiv.style.width = "150px";
    imgDiv.style.height = "100px";

    const img = document.createElement("img");
    img.className = "img-fluid";
    img.src = category.imagen_url || "img/Imagen't.jpg";
    img.alt = category.nombre;

    imgDiv.appendChild(img);

    // contenedor del texto
    const nameDiv = document.createElement("div");
    nameDiv.className = "flex-fill pl-3";

    const name = document.createElement("h6");
    name.textContent = category.nombre;

    nameDiv.appendChild(name);
    // Se construye el resultado final
    catItemDiv.appendChild(imgDiv);
    catItemDiv.appendChild(nameDiv);
    categoryLink.appendChild(catItemDiv);
    categoryDiv.appendChild(categoryLink);
    categoriesHomeContainer.appendChild(categoryDiv);
  });
};

const renderFiltrosProducto = function (categories) {
  if (categories.categorias?.length > 0) {
    // Necesario para darle checked = true a la categoría si viene de otra pestaña
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFilter = urlParams.get('category');

    const radioDivAll = document.createElement("div");
    radioDivAll.className = "custom-control custom-radio";

    const radioInputAll = document.createElement("input");
    radioInputAll.type = "radio";
    radioInputAll.className = "custom-control-input";
    radioInputAll.name = "type-filter";
    radioInputAll.value = "";
    radioInputAll.id = "type-all";
    radioInputAll.checked = !categoryFilter;

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
      radioInput.checked = category.id === categoryFilter;

      const radioLabel = document.createElement("label");
      radioLabel.className = "custom-control-label";
      radioLabel.setAttribute("for", `type-${category.nombre.toLowerCase()}`);
      radioLabel.textContent = category.nombre;

      radioDiv.appendChild(radioInput);
      radioDiv.appendChild(radioLabel);
      typeFilterContainer.appendChild(radioDiv);
    });
  } else {
    console.error("No se encontraron categorías.");
  }
}

export const cartTotal = function (cart) {
  let total = 0;
  console.log('Carrito: ', cart)
  cart.forEach(element => {
    total = total + parseInt(element.cantidad);
  });
  document.getElementById("cart-total").innerHTML = total;
}
