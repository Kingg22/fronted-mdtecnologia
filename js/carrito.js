document.addEventListener("DOMContentLoaded", async () => {
  try {
    const cart = JSON.parse(localStorage.getItem("cart"));
    const cartContainer = document.getElementById("cart-body");

    if (!cart) {
      cartContainer.innerHTML = `<tr>
      <td colspan="5" class="align-middle">Parece que no comprado nada aun, ¡Que espera compre ya!</td>
      </tr>`;
      return;
    }

    let tr_html = "";
    cart.forEach(element => {
      tr_html += `<tr>
    <td class="align-middle">
      <img src="${element.imagenes[0].url}" alt="" style="width: 50px" />
      ${element.nombre}
    </td>
    <td class="align-middle">$${element.proveedores[0].precio}</td>
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
          value="${element.custom_amount}"
        />
        <div class="input-group-btn">
          <button class="btn btn-sm btn-primary btn-plus">
            <i class="fa fa-plus"></i>
          </button>
        </div>
      </div>
    </td>
    <td class="align-middle">$${element.proveedores[0].precio * element.custom_amount}</td>
    <td class="align-middle">
      <button class="btn btn-sm btn-danger">
        <i class="fa fa-times"></i>
      </button>
    </td>
    </tr>`;
    });

    cartContainer.innerHTML = tr_html;
  } catch (error) {
    console.error("Error al cargar los detalles del producto:", error);
  }
});
