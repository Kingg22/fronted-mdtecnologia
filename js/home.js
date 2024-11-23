import { BASE_URL } from "./utils.js";

const equiposContainer = document.getElementById("equipos-container");
const slides = document.querySelectorAll('#header-carousel .carousel-item');

document.addEventListener('DOMContentLoaded', async function () {
  // Carrusel
  let slideIndex = 0;

  const showSlide = function (index) {
    slides.forEach((slide, i) => {
      slide.style.display = i === index ? 'block' : 'none';
      slide.classList.toggle('active', i === index);
    });
  };

  const nextSlide = function () {
    slideIndex = (slideIndex + 1) % slides.length;
    showSlide(slideIndex);
  };
  setInterval(nextSlide, 3000);
  showSlide(slideIndex);

  // 8 productos preview
  let opciones = new URLSearchParams({
    'size': 8,
    'page': 0,
    'orderBy': 'nombre'
  });
  fetch(`${BASE_URL}/Productos?${opciones}`)
    .then((response) => response.json())
    .then((data) => {
      data.productos?.forEach((producto) => {
        const productoDiv = document.createElement("div");
        productoDiv.className = "col-lg-3 col-md-4 col-sm-6 pb-1";

        const imgSrc = producto.imagenes?.[0]?.url || "img/Imagen't.png";
        const price = producto.proveedores?.[0]?.precio || "No disponible";

        productoDiv.innerHTML = `
                  <div class="product-item bg-light mb-4">
                    <div class="product-img position-relative overflow-hidden">
                      <img class="img-fluid w-100" src="${imgSrc}" alt="${producto.nombre}" style="width: 150px; height: 280px; object-fit: contain; background-color: #f8f9fa;" />
                    </div>
                    <div class="text-center py-4">
                      <a class="h6 text-decoration-none text-truncate" href="#">${producto.nombre}</a>
                      <div class="d-flex align-items-center justify-content-center mt-2">
                        <h5>$${price}</h5>
                      </div>
                    </div>
                  </div>
                `;
        equiposContainer.appendChild(productoDiv);
      })
    })
    .catch((error) => {
      console.error("Error al cargar preview productos:", error);
    });
});