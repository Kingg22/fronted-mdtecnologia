import { BASE_URL, eventManager } from "./utils.js";

/**
 * Representa a producto-detalle y 'cantidad' adicional para el carrito
 */
export interface CartItem {
  id: string;
  nombre: string;
  marca: string;
  descripcion: string;
  categoria: string;
  proveedores: {
    producto: string;
    proveedor: string;
    precio: number;
    impuesto: number;
    total: number;
    stock: number;
    fecha_actualizado: string;
  }[];
  imagenes: {
    descripcion?: string | null;
    url: string;
  }[];
  cantidad?: number;
}
export const cart: CartItem[] = JSON.parse(
  localStorage.getItem("cart") ?? "[]",
);

/**
 * Carga por defecto el header, navbar, footer, eventos de navbar, evento buscador google, cargar categorías navbar y render de carrito
 */
document.addEventListener("DOMContentLoaded", async function () {
  loadHeader();
  loadNavbar();
  loadFooter();

  //  Menú Desplegable
  const dropdownButton = document.querySelector(
    '.btn[data-toggle="collapse"]',
  ) as HTMLElement;
  const dropdownMenu = document.querySelector(
    "#navbar-vertical",
  ) as HTMLElement;

  if (dropdownButton && dropdownMenu) {
    dropdownButton.addEventListener("click", function (event: Event) {
      event.preventDefault();
      dropdownMenu.classList.toggle("show");
    });

    document.addEventListener("click", function (event: Event) {
      if (
        !dropdownButton.contains(event.target as Node) &&
        !dropdownMenu.contains(event.target as Node)
      ) {
        dropdownMenu.classList.remove("show");
      }
    });
  }

  // Evento de mostrar / ocultar contraseña
  document
    .querySelectorAll<HTMLImageElement>(".toggle-password")
    .forEach((img) => {
      img.addEventListener("click", () => {
        const target = document.getElementById(
          img.dataset.target as string,
        ) as HTMLInputElement;
        if (target.type === "password") {
          target.type = "text";
        } else {
          target.type = "password";
        }
      });
    });

  document.getElementById("clearButton")?.addEventListener("click", () => {
    const form = document.getElementById("searchForm") as HTMLFormElement;
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
      renderFiltrosProducto(categories);
      renderCategoriasHome(categories);
    })
    .catch((error) => console.error("Error al cargar las categorías:", error));
});

const renderCategoriasNavBar = function (categories: {
  categorias: { id: string; nombre: string }[];
}) {
  const categoriesContainer = document.getElementById(
    "navbar-categorias",
  ) as HTMLElement;
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
};

const renderCategoriasHome = function (categories: {
  categorias: { id: string; nombre: string; imagen_url?: string }[];
}) {
  const categoriesHomeContainer = document.getElementById(
    "categorias-bonitas-container",
  );
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

const renderFiltrosProducto = function (categories: {
  categorias: { id: string; nombre: string }[];
}) {
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
export const cartTotal = function (cart: CartItem[]) {
  let total = 0;
  console.log("Carrito: ", cart);
  cart.forEach((element) => {
    total = total + (element.cantidad ?? 1);
  });
  document.getElementById("cart-total")!.innerHTML = total.toString();
};

/**
 * Cargar header dinámicamente
 */
export const loadHeader = () => {
  document.querySelector("header")!.innerHTML = `
      <div class="row align-items-center bg-light py-3 px-xl-5 d-none d-lg-flex" style="margin-right: 0px">
        <div class="col-lg-4">
          <a href="Home.html" class="text-decoration-none">
            <img src="img/logo.png" alt="logo" />
          </a>
        </div>
        <div class="col-lg-4 col-6 text-left">
          <form id="searchForm" action="https://www.google.com/search" method="get" target="_blank">
            <div class="input-group">
              <input type="text" class="form-control" name="q" placeholder="Buscar en Google..." required />
              <div class="input-group-append">
                <button id="clearButton" type="button" class="input-group-text bg-transparent text-primary" style="border: none; cursor: pointer">
                  <i class="fa fa-search"></i>
                </button>
              </div>
            </div>
          </form>
        </div>
        <div class="col-lg-4 col-6 text-right">
          <p class="m-0">Nuestro Instagram</p>
          <a><h5 class="m-0">@mdtecnologiapa</h5></a>
        </div>
      </div>
    `;
};

/**
 * Cargar navbar dinámicamente
 */
export const loadNavbar = () => {
  document.querySelector("header")!.innerHTML += `
      <div class="container-fluid bg-dark mb-30">
        <div class="row px-xl-5">
          <div class="col-lg-3 d-none d-lg-block">
            <a class="btn d-flex align-items-center justify-content-between bg-primary w-100" data-toggle="collapse" href="#navbar-vertical" style="height: 65px; padding: 0 30px">
              <h6 class="text-dark m-0"><i class="fa fa-bars mr-2"></i>Categorías</h6>
              <i class="fa fa-angle-down text-dark"></i>
            </a>
            <nav class="collapse position-absolute navbar navbar-vertical navbar-light align-items-start p-0 bg-light" id="navbar-vertical" style="width: calc(100% - 30px); z-index: 999" aria-label="Navegación de categorías">
              <div class="navbar-nav w-100" id="navbar-categorias">
                <!-- Categorías generadas de forma dinámica -->
              </div>
            </nav>
          </div>
          <div class="col-lg-9">
            <nav class="navbar navbar-expand-lg bg-dark navbar-dark py-3 py-lg-0 px-0" aria-label="Barra de navegación principal">
              <a href="Home.html" class="text-decoration-none d-block d-lg-none">
                <img src="img/logoMDT.png" alt="logo" />
              </a>
              <button type="button" class="navbar-toggler" data-toggle="collapse" data-target="#navbarCollapse">
                <span class="navbar-toggler-icon"></span>
              </button>
              <div class="collapse navbar-collapse justify-content-between" id="navbarCollapse">
                <div class="navbar-nav mr-auto py-0">
                  <a href="Home.html" class="nav-item nav-link">Home</a>
                  <a href="Productos.html" class="nav-item nav-link">Productos</a>
                  <a href="Nosotros.html" class="nav-item nav-link">Sobre Nosotros</a>
                </div>
                <div class="navbar-nav ml-auto py-0 d-none d-lg-block">
                  <a href="Perfil.html" class="btn px-0">
                    <i class="fa-solid fa-circle-user text-primary" style="font-size: 1.3rem"></i>
                  </a>
                  <a href="Carrito.html" class="btn px-0 ml-3">
                    <i class="fas fa-shopping-cart text-primary"></i>
                    <span class="badge text-secondary border border-secondary rounded-circle" style="padding-bottom: 2px" id="cart-total">0</span>
                  </a>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    `;
};

/**
 * Cargar breadcrumb dinámicamente
 */
export const loadBreadcrumb = (
  paths: { name: string; href: string | null }[],
) => {
  document.getElementById("breadcrumb")!.innerHTML = `<div class="row px-xl-5">
        <div class="col-12">
          <nav
            class="breadcrumb bg-light mb-30"
            aria-label="Ruta de navegación producto"
          >
            <!-- Breadcrumb dinámico -->
          </nav>
        </div>
      </div>`;
  document.querySelector(".breadcrumb")!.innerHTML = paths
    .map((path) =>
      path.href
        ? `<a class="breadcrumb-item text-dark" href="${path.href}">${path.name}</a>`
        : `<span class="breadcrumb-item active">${path.name}</span>`,
    )
    .join("");
};

/**
 *  Cargar footer dinámicamente
 */
export const loadFooter = () => {
  document.querySelector("footer")!.innerHTML = `
            <div class="container-fluid bg-dark text-secondary mt-5 pt-5">
              <div class="row px-xl-5 pt-5">
                <div class="col-lg-4 col-md-12 mb-5 pr-3 pr-xl-5">
                  <h5 class="text-secondary text-uppercase mb-4">Contáctenos</h5>
                  <p class="mb-2">
                    <i class="fa fa-envelope text-primary mr-3"></i>
                    mdtpanama@gmail.com
                  </p>
                  <p class="mb-0">
                    <i class="fa fa-phone-alt text-primary mr-3"></i>
                    +507 6030-9572
                  </p>
                </div>
                <div class="col-lg-8 col-md-12">
                  <div class="row">
                    <div class="col-md-4 mb-5">
                      <h5 class="text-secondary text-uppercase mb-4">MD Tech</h5>
                      <div class="d-flex flex-column justify-content-start">
                        <a class="text-secondary mb-2" href="Home.html">
                          <i class="fa fa-angle-right mr-2"></i>Inicio
                        </a>
                        <a class="text-secondary mb-2" href="Productos.html">
                          <i class="fa fa-angle-right mr-2"></i>Productos
                        </a>
                        <a class="text-secondary" href="Nosotros.html">
                          <i class="fa fa-angle-right mr-2"></i>Sobre Nosotros
                        </a>
                      </div>
                    </div>
                    <div class="col-md-4 mb-5">
                      <h5 class="text-secondary text-uppercase mb-4">Mi cuenta</h5>
                      <div class="d-flex flex-column justify-content-start">
                        <a class="text-secondary mb-2" href="Login.html">
                          <i class="fa fa-angle-right mr-2"></i>Iniciar Sesión
                        </a>
                        <a class="text-secondary mb-2" href="Carrito.html">
                          <i class="fa fa-angle-right mr-2"></i>Ver Carrito
                        </a>
                        <a class="text-secondary mb-2" href="Perfil.html">
                          <i class="fa fa-angle-right mr-2"></i>Perfil
                        </a>
                      </div>
                    </div>
                    <div class="col-md-4 mb-5">
                      <h6 class="text-secondary text-uppercase mt-4 mb-3">
                        Síguenos
                      </h6>
                      <div class="d-flex">
                        <a class="btn btn-primary btn-square mr-2" href="https://www.facebook.com/profile.php?id=100069208843188">
                          <i class="fa-brands fa-facebook fa-lg"></i>
                        </a>
                        <a class="btn btn-primary btn-square" href="https://www.instagram.com/mdtecnologiapa?igsh=ZHdrNXoxeXZjaXBh">
                          <i class="fa-brands fa-instagram fa-xl"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        `;
};
