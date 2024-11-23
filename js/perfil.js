import { BASE_URL } from "./utils.js";

const ordersTableBody = document.getElementById("orders_table_body");

document.addEventListener("DOMContentLoaded", async function () {
  const id_cliente = "55311cd6-13cc-42f3-8ec0-df83f2fb9ea6";
  const token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJjMjY2NjE0MC1jYmVhLTQ5ZjUtYTU2MS05NzI5NmE1ODQwM2EiLCJyb2xlIjoiY2xpZW50ZSIsIm5iZiI6MTczMjMxOTY3NiwiZXhwIjoxNzMyMzIzMjc2LCJpYXQiOjE3MzIzMTk2NzYsImlzcyI6Ik1EVEVDSCJ9.mghDHfvocv6JmxNCU6mF_kXAcSCGErQhPikXSHuSuFPrjpssR4sVtEtNBuHzDMFSySiHNlOZBvt5bXrQh8-JmfKp_6W-BgaOC4B75Z4Mn45OqSo5ZC4HkMhWzVdXQWVCEXVqJXelBN2xXpxV5qR0nTroMYkX6ephUTTaC9cFeFnWdyTt9PjiDtyrk8p-AeKoSxV-9L2abu5E3sQKsNl5SsKlCCAR4WGHO-imPKweWegJFjKI5V-upAmdMxVXqjFjY4H23m7rQa-YDIKEh4izkUuI8It-sBYxyH4BMYrE80HnooDZw1vil_bYaBC5btzsU3fcGs_LSbTGHZdrynlP2g";
  fetch(`${BASE_URL}/Clientes/${id_cliente}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => response.json())
    .then((data) => {
      console.log(data)
      const cliente = data.cliente;

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
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then(response => response.json)
    .then(ventas => {
      ordersTableBody.innerHTML = "";

      if (ventas.length > 0) {
        ventas.forEach((venta) => {
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
            case 0:
              statusBadge.textContent = "Procesando";
              statusBadge.classList.add("bg-warning", "text-dark");
              break;
            case 1:
              statusBadge.textContent = "Cancelado";
              statusBadge.classList.add("bg-danger", "text-white");
              break;
            case 2:
              statusBadge.textContent = "Entregado";
              statusBadge.classList.add("bg-success", "text-white");
              break;
            default:
              statusBadge.textContent = "En espera";
              statusBadge.classList.add("bg-secondary", "text-white");
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
