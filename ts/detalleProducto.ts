import { BASE_URL, eventManager } from "./utils.js";
import { cartTotal, cart, CartItem, loadBreadcrumb } from "./main.js";

let product: CartItem;

document.addEventListener("DOMContentLoaded", () => {
  loadBreadcrumb([
    { name: "Inicio", href: "Home.html" },
    { name: "Productos", href: "Productos.html" },
    { name: "Detalle", href: null },
  ]);
  const productId = new URLSearchParams(window.location.search).get("id");
  if (!productId) window.location.replace("/Productos.html");
  // Carrusel de imágenes producto
  const items = document.querySelectorAll(".carousel-item");
  let currentIndex = 0;

  const updateCarousel = () => {
    items.forEach((item, index) => {
      item.classList.remove("active");
      if (index === currentIndex) {
        item.classList.add("active");
      }
    });
  };

  document.getElementById("prev")!.addEventListener("click", () => {
    currentIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
    updateCarousel();
  });

  document.getElementById("next")!.addEventListener("click", () => {
    currentIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
    updateCarousel();
  });

  // Productos Cantidad
  document.querySelectorAll(".quantity button").forEach(function (button) {
    button.addEventListener("click", function () {
      let input = button
        .closest(".quantity")!
        .querySelector("input") as HTMLInputElement;
      let oldValue = parseFloat(input.value);
      let newVal;
      if (button.classList.contains("btn-plus")) {
        newVal = oldValue + 1;
      } else {
        newVal = oldValue > 0 ? oldValue - 1 : 0;
      }
      input.value = newVal.toString();
    });
  });

  // Función para buscar productos a la API
  eventManager(async () => {
    fetch(`${BASE_URL}/Productos/${productId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data?.producto as CartItem) {
          product = data.producto;
          document.getElementById("product-name")!.innerHTML =
            data.producto.nombre;
          document.querySelector(".breadcrumb-item.active")!.textContent =
            data.producto.nombre;
          document.getElementById("product-brand")!.innerHTML =
            data.producto.marca;
          document.getElementById("product-price")!.textContent =
            "$" + data.producto.proveedores?.[0]?.precio.toFixed(2) ||
            "No disponible";
          document.getElementById("product-description")!.innerHTML =
            data.producto.descripcion;

          let imgs_html = "";
          data.producto.imagenes.forEach(
            (element: { description: string; url: string }) => {
              imgs_html += `<div class="carousel-item active"><img class="d-block w-100" src="${element.url}" alt=${element.description || "Imagen de referencia producto"}></div>`;
            },
          );
          document.getElementById("carousel-inner")!.innerHTML = imgs_html;
        }
      })
      .catch((error) => console.error("Error en detalle producto: ", error));
  })();

  document.getElementById("add-cart")!.addEventListener("click", () => {
    if (!product) {
      return;
    }

    let temp = (document.getElementById("product-amount")! as HTMLInputElement)
      .value;
    let cantidad = parseInt(temp);
    if (!cantidad || cantidad === 0) {
      return;
    }
    product["cantidad"] = cantidad;
    cart.push(product);

    localStorage.setItem("cart", JSON.stringify(cart));
    cartTotal(cart);
    alert("¡Se ha agregado con éxito!");
  });
});
