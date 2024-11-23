import { BASE_URL } from "./utils.js";

const ordersTableBody = document.getElementById("orders_table_body");

document.addEventListener("DOMContentLoaded", async function () {
  const id_cliente = window.sessionStorage.getItem('id_cliente');
  const token = window.sessionStorage.getItem('token');
  if (!token)
    window.location.href = "/Login.html";
  document.getElementById("logout_button").addEventListener("click", () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/Login.html";
  });

  fetch(`${BASE_URL}/Clientes/${id_cliente}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "accept": "application/json",
    },
  }).then((response) => response.json())
    .then((data) => {
      const cliente = data.cliente;
      sessionStorage.setItem('cliente', JSON.stringify(cliente));
      const fullName =
        `${cliente.nombre || ""} ${cliente.apellido || ""}`.trim() ||
        "Nombre Confidencial";
      document.getElementById("user_name").textContent = fullName;

      document.getElementById("user_email").textContent = "Correo: " + cliente.correo;

      document.getElementById("user_phone").textContent = cliente.telefono || "Teléfono: No registrado";

      const addresses = cliente.direcciones || [];
      const addressList = document.getElementById("user_addresses");
      addressList.innerHTML = "";

      if (addresses.length > 0) {
        addresses.slice(0, 3).forEach((direccion) => {
          const li = document.createElement("li");
          li.textContent = direccion.descripcion + ', ' + direccion.provincia || "Dirección Registrada";
          addressList.appendChild(li);
        });
      } else {
        const li = document.createElement("li");
        li.textContent = "Direcciones No Registrada";
        addressList.appendChild(li);
      }
    })
    .catch((error) => {
      console.error("Hubo un problema con la solicitud:", error);
    })

  fetch(`${BASE_URL}/Ventas/cliente/${id_cliente}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "accept": "application/json",
    },
  }).then(response => response.json())
    .then(data => {
      ordersTableBody.innerHTML = "";

      if (data.ventas?.length > 0) {
        data.ventas.forEach((venta) => {
          const row = document.createElement("tr");

          // ID del pedido
          const idCell = document.createElement("td");
          idCell.textContent = `#${venta.id}`;
          row.appendChild(idCell);

          // Total
          const totalCell = document.createElement("td");
          totalCell.textContent = `${venta.total}$`;
          row.appendChild(totalCell);

          // Estado
          const statusCell = document.createElement("td");
          const statusBadge = document.createElement("span");
          statusBadge.textContent = venta.estado;
          statusBadge.classList.add("badge");

          switch (venta.estado) {
            case "PROCESANDO":
              statusBadge.textContent = "Procesando";
              statusBadge.classList.add("bg-warning", "text-dark");
              break;
            case "CANCELADO":
              statusBadge.textContent = "Cancelado";
              statusBadge.classList.add("bg-danger", "text-white");
              break;
            case "ENTREGADO":
              statusBadge.textContent = "Entregado";
              statusBadge.classList.add("bg-success", "text-white");
              break;
            default:
              statusBadge.textContent = venta.estado;
              statusBadge.classList.add("bg-secondary", "text-white");
              console.warn('No se ha podido pintar el estado del producto correctamente')
              break;
          }

          statusCell.appendChild(statusBadge);
          row.appendChild(statusCell);
          ordersTableBody.appendChild(row);
        });
      } else {
        // Mostrar mensaje de no hay pedidos
        const noOrdersRow = document.createElement("tr");
        const noOrdersCell = document.createElement("td");
        noOrdersCell.colSpan = 3;
        noOrdersCell.textContent = "Parece que no comprado nada aun, ¡Que espera compre ya!";
        noOrdersCell.classList.add("text-center");
        noOrdersRow.appendChild(noOrdersCell);
        ordersTableBody.appendChild(noOrdersRow);
      }
    }).catch((error) => {
      console.error("Hubo un problema con la solicitud:", error);
    })
});
