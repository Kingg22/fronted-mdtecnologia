import { BASE_URL } from "./utils.js";
document.addEventListener("DOMContentLoaded", async function () {
  function filtrador(id) {
    fetch("https://dummyjson.com/products", {
      //fetch(${BASE_URL}/Productos?categoria=${id}, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          console.log(data);
          data.products.forEach((producto) => {
            const productoDiv = document.createElement("div");
            productoDiv.className="";
      
            productoDiv.innerHTML = `
            <div class="product-item bg-light mb-4">
              <div class="product-img position-relative overflow-hidden">
                <img class="img-fluid w-100" src="${producto.images[0]}" alt="${
            producto.title
          }" />
              </div>
              <div class="text-center py-4">
                <a class="h6 text-decoration-none text-truncate" href="#">${
                  producto.title
                }</a>
                <div class="d-flex align-items-center justify-content-center mt-2">
                  <h5>$${producto.price.toFixed(2)}</h5>
                </div>
              </div>
            </div>
          `;
          const filtcontiner = document.getElementById("filtcontiner");
          filtcontiner.appendChild(productoDiv);
        });
      } else {
        alert("Filtrado fallido");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Hubo un problema con el flitrado, inténtelo de nuevo");
    });
}
document.querySelectorAll('input[class="custom-control-input filtromita"]').forEach((r) => {
  r.addEventListener("change", (e) => {
    const categoryid = r.getAttribute("data-category-id");
    filtrador(categoryid);
    console.log("Se completo con existo");
  });
});
}); 