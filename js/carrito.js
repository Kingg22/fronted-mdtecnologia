import { cart } from "./main.js"
import { BASE_URL, eventManager } from "./utils.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const cartContainer = document.getElementById("cart-body");

    if (!cart) {
      cartContainer.innerHTML = `<tr>
      <td colspan="5" class="align-middle">Parece que no comprado nada aun, ¡Que espera compre ya!</td>
      </tr>`;
      return;
    }

    let tr_html = "";
    cart.forEach(element => {
      tr_html += `<tr data-product-id="${element.id}">
    <td class="align-middle" style="text-align: left;">
      <img src="${element.imagenes[0].url}" alt="" style="width: 50px; margin-right: 10px;" />
      ${element.nombre}
    </td>
    <td class="align-middle">$${element.proveedores[0].precio.toFixed(2)}</td>
    <td class="align-middle">
      <div
        class="input-group quantity mx-auto"
        style="width: 100px"
      >
        <div class="input-group-btn">
          <button class="btn btn-sm btn-primary btn-minus">
            <i class="fa fa-minus"></i>
          </button>
        </div>
        <input
          type="text"
          class="form-control form-control-sm bg-secondary border-0 text-center"
          value="${element.cantidad}"
        />
        <div class="input-group-btn">
          <button class="btn btn-sm btn-primary btn-plus">
            <i class="fa fa-plus"></i>
          </button>
        </div>
      </div>
    </td>
    <td class="align-middle">$${element.proveedores[0].precio * element.cantidad}</td>
    </tr>`;
    });

    cartContainer.innerHTML = tr_html;
    calculateCartTotal();

    // Agregar eventos de clic a los botones de aumentar y disminuir
    document.querySelectorAll(".btn-minus").forEach(button => {
      button.addEventListener("click", function () {
        const productId = this.closest("tr").getAttribute("data-product-id");
        const input = this.closest("tr").querySelector("input");
        let currentQuantity = parseInt(input.value);
        if (currentQuantity > 1) {
          currentQuantity--;
          input.value = currentQuantity;
          updateCarQuantity(productId, currentQuantity);
          refreshPriceRow(productId);
          calculateCartTotal();
        }
      });
    });

    document.querySelectorAll(".btn-plus").forEach(button => {
      button.addEventListener("click", function () {
        const productId = this.closest("tr").getAttribute("data-product-id");
        const input = this.closest("tr").querySelector("input");
        let currentQuantity = parseInt(input.value);
        currentQuantity++;
        input.value = currentQuantity;
        updateCarQuantity(productId, currentQuantity);
        refreshPriceRow(productId);
        calculateCartTotal();
      });
    });

    document.getElementById('finish-cart').addEventListener('click', function () {
      if (cart.length === 0) {
        alert('Carrito de compra vacío')
        return false;
      }
      if (!sessionStorage.getItem('cliente') || !sessionStorage.getItem('token')) {
        window.location.href = "/Login.html";
        alert('Debe iniciar sesión antes de finalizar su compra')
        return false;
      }
      finalizarVenta();
    });
  } catch (error) {
    console.error("Error al cargar los detalles del carrito:", error);
  }
});

function calculateCartTotal() {
  let subtotal = 0;
  let taxes = 0;

  cart.forEach(item => {
    subtotal += parseInt(item.proveedores?.[0]?.precio) * (parseInt(item.cantidad) || 1);
    taxes += parseInt(item.proveedores?.[0]?.impuesto) * (parseInt(item.cantidad) || 1);
  });

  let total = subtotal + taxes;

  // Actualizar los valores en el HTML
  document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById("total").textContent = `$${total.toFixed(2)}`;
  document.getElementById("taxes").textContent = `$${taxes.toFixed(2)}`;
}

const updateCarQuantity = (productId, newQuantity) => {
  let productIndex = cart.findIndex(item => String(item.id) === String(productId));
  if (productIndex !== -1) {
    cart[productIndex].cantidad = newQuantity;
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('Se ha actualizado el carrito', cart)
  }
};

// Función para actualizar el precio en su fila
function refreshPriceRow(productId) {
  let productIndex = cart.findIndex(item => item.id === productId);
  if (productIndex !== -1) {
    const row = document.querySelector(`tr[data-product-id="${productId}"]`);
    const quantity = cart[productIndex].cantidad;
    const price = cart[productIndex].proveedores[0].precio;
    row.querySelector("td:nth-child(4)").textContent = `$${(price * quantity).toFixed(2)}`;
  }
}

const finalizarVenta = eventManager(async () => {
  const token = sessionStorage.getItem('token')
  const cliente = JSON.parse(sessionStorage.getItem('cliente'))
  if (!cliente.direcciones) {
    alert('No tiene direcciones registradas, no es posible registrar su compra sin una dirección de envío')
    return;
  }
  const detalles = cart.map(item => ({
    cantidad: item.cantidad,
    producto: item.id
  }));
  fetch(`${BASE_URL}/Ventas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "accept": "application/json",
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      cliente: cliente.id,
      direccion_entrega: cliente.direcciones?.[0]?.id,
      detalles: detalles
    }),
  }).then(response => response.json())
    .then(data => {
      console.log(data)
      if (data) {
        alert('Gracias por su compra, su compra esta en proceso')
      } else {
        alert('No se ha podido guardar su compra, intente nuevamente')
      }
      localStorage.removeItem('cart')
    })
    .catch(error => console.error("Error al finalizar la venta: ", error))
})
