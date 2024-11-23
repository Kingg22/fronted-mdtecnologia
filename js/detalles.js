import { BASE_URL, eventManager } from "./utils.js";

document.addEventListener("DOMContentLoaded", async () => {
    try {

        const productId = new URLSearchParams(window.location.search).get("id");
        window.product = {};
        // Función para buscar productos a la API
        const searchProducts = eventManager(async function cargarDetalle() {

            fetch(`${BASE_URL}/Productos/${productId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            })
            .then((response) => response.json())
            .then((data) => {
                console.log("Detalles: ", data);
                window.product = data.producto;
                document.getElementById("product-name").innerHTML = data.producto.nombre;
                document.getElementById("product-brand").innerHTML = data.producto.marca;
                document.getElementById("product-description").innerHTML = data.producto.descripcion;

                let imgs_html = "";
                data.producto.imagenes.forEach(element => {
                        imgs_html += `<div class="carousel-item active"><img class="d-block w-100" src="${element.url}" alt="First slide"></div>`;
                });
                document.getElementById("carousel-inner").innerHTML = imgs_html;


            })
            .catch((error) => {
                console.error("Error:", error);
            });
        });

        searchProducts();


    } catch (error) {
        console.error("Error al cargar los detalles del producto:", error);
    }

    const addCartBtn = document.getElementById("add-cart");
    addCartBtn.addEventListener("click",  () => {

        if(!window.product){
            return false;
        }

        window.product["custom_amount"] =  document.getElementById("product-amount").value || 1;

        const cart = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
        cart.push(window.product);
        localStorage.setItem("cart", JSON.stringify(cart));
        cartTotal(cart);
    });

    const cartTotal = function(cart){
        let total = 0;
        cart.forEach(element => {
            console.log(element);
            total = total + parseInt(element.custom_amount);
        });
        document.getElementById("cart-total").innerHTML = total;
    }
});
