import { BASE_URL, eventManager } from "./utils.js";

document.addEventListener("DOMContentLoaded", async function () {
  // agrega al filtro de categorías si viene de otra pestaña
  const urlParams = new URLSearchParams(window.location.search);
  const categoryFilter = urlParams.get('category');
  if (categoryFilter)
    currentFilter = categoryFilter;
  await searchProducts();
});

const size = 12;
let page = 0;
let cantidad = 0;
let totalPages = 0;
let currentFilter = "";
const filtContainer = document.getElementById("filtcontiner");
const paginationContainer = document.querySelector(".pagination");

// Función para buscar productos a la API
const searchProducts = eventManager(async function cargarProductos() {
  let opciones = new URLSearchParams({
    'size': size,
    'page': page,
    'categoria': currentFilter
  });
  fetch(`${BASE_URL}/Productos?${opciones}`)
    .then((response) => response.json())
    .then((data) => {
      cantidad = data.count;
      totalPages = Math.ceil(cantidad / size);
      renderProducts(data.productos);
      renderPagination();
    })
    .catch((error) => {
      console.error("Error al cargar producto:", error);
    });
})

function renderProducts(products) {
  if (products.length > 0) {
    filtContainer.innerHTML = "";
    products.forEach((producto) => {
      const productoDiv = document.createElement("div");
      productoDiv.className = "col-lg-4 col-md-6";

      const imgSrc = producto.imagenes?.[0]?.url || "img/Imagen't.png";
      const price = "$" + producto.proveedores?.[0]?.precio.toFixed(2) || "No disponible";

      productoDiv.innerHTML = `
          <div class="product-item bg-light mb-4">
            <div class="product-img position-relative overflow-hidden">
              <a href="Detalles.html?id=${producto.id}"><img class="img-fluid w-100" src="${imgSrc}" alt="${producto.nombre}" style="width: 150px; height: 280px; object-fit: contain; background-color: #f8f9fa;" /></a>
            </div>
            <div class="text-center py-4">
              <a class="h6 text-decoration-none text-truncate" href="Detalles.html?id=${producto.id}">${producto.nombre}</a>
              <div class="d-flex align-items-center justify-content-center mt-2">
                <h5>${price}</h5>
              </div>
            </div>
          </div>
        `;
      filtContainer.appendChild(productoDiv);
    });
  } else {
    filtContainer.innerHTML = "<p>No se encontraron productos.</p>";
  }
}

function renderPagination() {
  paginationContainer.innerHTML = "";

  const previous = document.createElement("li");
  previous.className = `page-item ${page === 0 ? "disabled" : ""}`;
  previous.innerHTML = `<a class="page-link" href="#">Anterior</a>`;
  paginationContainer.appendChild(previous);

  for (let i = 0; i < totalPages; i++) {
    const pageItem = document.createElement("li");
    pageItem.className = `page-item ${i === page ? "active" : ""}`;
    pageItem.innerHTML = `<a class="page-link" href="#">${i + 1}</a>`;
    paginationContainer.appendChild(pageItem);
  }
  const next = document.createElement("li");
  next.className = `page-item ${page === totalPages - 1 ? "disabled" : ""}`;
  next.innerHTML = `<a class="page-link" href="#">Siguiente</a>`;
  paginationContainer.appendChild(next);
}

// Event para los filtros
document.querySelector('button.btn-primary').addEventListener("click", async () => {
  const selectedFilter = document.querySelector('input[name="type-filter"]:checked').value;
  currentFilter = selectedFilter;
  page = 0;
  await searchProducts();
});

// Event para cambio de pagina
paginationContainer.addEventListener("click", async (e) => {
  if (e.target.tagName === "A" && !e.target.parentElement.classList.contains("disabled")) {
    e.preventDefault();
    const action = e.target.textContent.trim();
    if (action === "Anterior" && page > 0) {
      page -= 1;
    } else if (action === "Siguiente") {
      page += 1;
    } else if (!isNaN(action)) {
      page = parseInt(action, 10) - 1;
    }
    await searchProducts();
  }
});
