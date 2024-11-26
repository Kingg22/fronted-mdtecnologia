import { BASE_URL, eventManager } from "./utils.js";
import { Modal, Tooltip } from "bootstrap";
export const cart = JSON.parse(localStorage.getItem("cart") ?? "[]");
/**
 * Carga por defecto el header, navbar, footer, eventos de navbar, evento buscador google, cargar categorías navbar y render de carrito
 */
document.addEventListener("DOMContentLoaded", async function () {
    loadHeader();
    loadFooter();
    // Evento de mostrar / ocultar contraseña
    document
        .querySelectorAll(".toggle-password")
        .forEach((img) => {
        img.addEventListener("click", () => {
            const target = document.getElementById(img.dataset.target);
            if (target.type === "password") {
                target.type = "text";
            }
            else {
                target.type = "password";
            }
        });
    });
    // Activar Tooltips
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((tooltip) => {
        new Tooltip(tooltip);
    });
    await cargarCategorias();
    cartTotal(cart);
});
export function showModal(id) {
    const modal = new Modal(document.getElementById(id));
    modal.show();
}
const cargarCategorias = eventManager(async () => {
    fetch(`${BASE_URL}/Categorias`)
        .then((response) => response.json())
        .then((categories) => {
        renderCategoriasNavBar(categories);
        renderFiltrosProducto(categories);
        renderCategoriasHome(categories);
    })
        .catch((error) => console.error("Error al cargar las categorías:", error));
});
const renderCategoriasNavBar = function (categories) {
    const categoriesContainer = document.getElementById("navbar-categorias");
    if (categories.categorias?.length > 0) {
        categoriesContainer.innerHTML = "";
        categories.categorias.forEach((category) => {
            const categoryList = document.createElement("li");
            const categoryLink = document.createElement("a");
            categoryLink.href = `Productos.html?category=${category.id}`;
            categoryLink.className = "dropdown-item";
            categoryLink.textContent = category.nombre;
            categoryList.appendChild(categoryLink);
            categoriesContainer.appendChild(categoryList);
        });
    }
    else {
        console.error("No se encontraron categorías.");
    }
};
const renderCategoriasHome = function (categories) {
    const categoriesHomeContainer = document.getElementById("categorias-bonitas-container");
    if (categoriesHomeContainer && categories.categorias?.length > 0) {
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
            img.src = category.imagen_url ?? "img/Imagen't.jpg";
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
    }
};
const renderFiltrosProducto = function (categories) {
    const typeFilterContainer = document.getElementById("type-filter-container");
    if (typeFilterContainer && categories.categorias?.length > 0) {
        // Necesario para darle checked = true a la categoría si viene de otra pestaña
        const urlParams = new URLSearchParams(window.location.search);
        const categoryFilter = urlParams.get("category");
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
        radioLabelAll.textContent = "Todos";
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
            radioInput.setAttribute("data-category-id", category.id);
            radioInput.checked = category.id === categoryFilter;
            const radioLabel = document.createElement("label");
            radioLabel.className = "custom-control-label";
            radioLabel.setAttribute("for", `type-${category.nombre.toLowerCase()}`);
            radioLabel.textContent = category.nombre;
            radioDiv.appendChild(radioInput);
            radioDiv.appendChild(radioLabel);
            typeFilterContainer.appendChild(radioDiv);
        });
    }
};
/**
 * Muestra la cantidad de productos en el carrito del navbar
 * @param cart Carrito del usuario
 */
export const cartTotal = function (cart) {
    let total = 0;
    cart.forEach((element) => {
        total += element.cantidad ?? 1;
    });
    document.getElementById("cart-total").innerHTML = total.toString();
};
/**
 * Cargar header dinámicamente
 */
export const loadHeader = () => {
    document.querySelector("header").innerHTML = `
      <!-- Top Bar -->
      <nav class="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">
        <div class="container">
          <!-- Logo -->
          <a class="navbar-brand bg-light" href="/Home.html">
            <img src="/img/logo.png" alt="Logo" style="height: 50px" />
          </a>
          <!-- Navbar toggler -->
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <!-- Navbar links -->
          <div class="collapse navbar-collapse" id="navbarNav">
            <!-- Navbar -->
            <ul
              class="navbar-nav navbar-nav-scroll me-auto my-2 my-lg-0"
              style="--bs-scroll-height: 200px"
            >
              <li class="nav-item dropdown">
                <a
                  class="nav-link dropdown-toggle text-white"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Categorías
                </a>
                <ul id="navbar-categorias" class="dropdown-menu">
                  <!-- Generado de forma dinámica -->
                </ul>
              </li>
              <li class="nav-item">
                <a class="nav-link text-white" href="/Home.html">Home</a>
              </li>
              <li class="nav-item">
                <a class="nav-link text-white" href="/Productos.html"
                  >Productos</a
                >
              </li>
              <li class="nav-item">
                <a class="nav-link text-white" href="/Nosotros.html"
                  >Sobre Nosotros</a
                >
              </li>
            </ul>
            <!-- Search bar -->
            <form class="d-flex" 
            role="search"
            action="https://www.google.com/search"
            method="get"
            target="_self">
              <input
                class="form-control me-2"
                type="search"
                name="q"
                placeholder="Buscar en Google..."
                aria-label="Search"
                required
              />
              <button class="btn btn-light" type="submit">
                <i class="fa fa-search"></i>
              </button>
            </form>
            <a href="/Perfil.html" class="btn px-4">
              <i
                class="fa-solid fa-circle-user"
                style="font-size: 1.15rem"
              ></i>
            </a>
            <a href="/Carrito.html" class="btn px-1">
              <i class="fas fa-shopping-cart"></i>
              <span
                class="badge bg-secondary rounded-circle"
                id="cart-total"
              >
                0
              </span>
            </a>
          </div>
        </div>
      </nav>
    `;
};
/**
 * Cargar breadcrumb dinámicamente
 */
export const loadBreadcrumb = (paths) => {
    document.getElementById("breadcrumb").innerHTML = `
          <nav
            aria-label="Ruta de navegación"
          >
          <ol class="breadcrumb"></ol>
            <!-- Breadcrumb dinámico -->
          </nav>`;
    document.querySelector(".breadcrumb").innerHTML = paths
        .map((path) => path.href
        ? `<li class="breadcrumb-item"><a href="${path.href}">${path.name}</a></li>`
        : `<li class="breadcrumb-item active" aria-current="page">${path.name}</li>`)
        .join("");
};
/**
 *  Cargar footer dinámicamente
 */
export const loadFooter = () => {
    const footer = document.querySelector("footer");
    footer.className = "text-light bg-dark py-4";
    footer.innerHTML = `
      <div class="container">
        <div class="row text-center text-md-start">
          <!-- Sección Contacto -->
          <div class="col-md-4 mb-3">
            <h5>CONTÁCTENOS</h5>
            <a href="mailto:mdtpanama@gmail.com" class="btn text-light" data-bs-toggle="tooltip" data-bs-title="Correo">
              <i class="fa fa-envelope text-primary"></i>
              mdtpanama@gmail.com
            </a>
            <a href="https://api.whatsapp.com/send?phone=50766061426" class="btn text-light" 
                data-bs-toggle="tooltip" data-bs-title="Whatsapp o llamadas">
              <i class="fa fa-phone-alt text-primary"></i>
              +507 6030-9572
            </a>
          </div>
          <!-- Sección MD Tecnología -->
          <div class="col-md-4 mb-3">
            <h5>MD TECNOLOGÍA</h5>
            <ul class="list-unstyled">
              <li>
                <a href="/Home.html" class="text-light text-decoration-none">Inicio</a>
              </li>
              <li>
                <a href="/Productos.html" class="text-light text-decoration-none">Productos</a>
              </li>
              <li>
                <a href="/Nosotros.html" class="text-light text-decoration-none">Sobre Nosotros</a>
              </li>
            </ul>
          </div>
          <!-- Sección Mi Cuenta -->
          <div class="col-md-4 mb-3">
            <h5>MI CUENTA</h5>
            <ul class="list-unstyled">
              <li>
                <a href="/Login.html" class="text-light text-decoration-none">Iniciar Sesión</a>
              </li>
              <li>
                <a href="/Carrito.html" class="text-light text-decoration-none">Ver Carrito</a>
              </li>
              <li>
                <a href="/Perfil.html" class="text-light text-decoration-none">Perfil</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="row mb-3 justify-content-center">
          <!-- Redes Sociales -->
          <div class="col">
            <h5 class="text-uppercase">Síguenos</h5>
            <a href="https://www.facebook.com/profile.php?id=100069208843188" class="btn btn-primary rounded-circle me-2" 
               data-bs-toggle="tooltip" data-bs-title="Facebook">
              <i class="fa-brands fa-facebook"></i>
            </a>
            <a href="https://www.instagram.com/mdtecnologiapa" class="btn btn-primary rounded-circle"
                data-bs-toggle="tooltip" data-bs-title="Instagram">
              <i class="fa-brands fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>
        `;
};
