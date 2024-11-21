import { BASE_URL } from "./utils.js";

document.addEventListener("DOMContentLoaded", function () {
  async function filtrador(id) {
    try {
      const response = await fetch("https://dummyjson.com/products", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data && data.products) {
        // Filtrar productos si no es "todos"
        const productosFiltrados =
          id === "todos"
            ? data.products
            : data.products.filter((producto) => producto.categoryId == id);

        // Limitar a un máximo
        const productosLimitados = productosFiltrados.slice(0, 9);

        // Limpiar el contenedor
        const filtcontiner = document.getElementById("filtcontiner");
        filtcontiner.innerHTML = "";

        // Verificar si hay productos
        if (productosLimitados.length === 0) {
          filtcontiner.innerHTML = "<p>No hay productos en esta categoría.</p>";
          return;
        }
        productosLimitados.forEach((producto) => {
          const productoDiv = document.createElement("div");
          productoDiv.className = "col-lg-4 col-md-6 col-sm-6 pb-1";

          productoDiv.innerHTML = `
            <div class="product-item bg-light mb-4">
              <div class="product-img position-relative overflow-hidden">
                <img class="img-fluid w-100" src="${producto.images[0]}" alt="${producto.title}" />
              </div>
              <div class="text-center py-4">
                <a class="h6 text-decoration-none text-truncate" href="#">${producto.title}</a>
                <div class="d-flex align-items-center justify-content-center mt-2">
                  <h5>$${producto.price.toFixed(2)}</h5>
                </div>
              </div>
            </div>
          `;
          filtcontiner.appendChild(productoDiv);
        });
      } else {
        alert("No se encontraron productos.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema al filtrar los productos. Por favor, inténtelo de nuevo.");
    }
  }

  document.querySelectorAll('input[class="custom-control-input filtromita"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      const categoryId = radio.getAttribute("data-category-id") || "todos";
      filtrador(categoryId);
    });
  });

  // para que ya tenga productos al iniciar
  filtrador("todos");
});
