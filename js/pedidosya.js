import { BASE_URL } from "./utils.js";

document.addEventListener("DOMContentLoaded", async function () {
  const clienteId = "40e722a8-7261-4858-8f4f-4b9d1e53062c";
  const token =
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxOGQxZmY1Yi1lNjM5LTRkZjctOWJiZC1jZmQ1ZmJiNTEyZmYiLCJyb2xlIjoiY2xpZW50ZSIsIm5iZiI6MTczMjMxNDg0MywiZXhwIjoxNzMyMzE4NDQzLCJpYXQiOjE3MzIzMTQ4NDMsImlzcyI6Ik1EVEVDSCJ9.vF7f_M2DNSA9z543LuqWuEA9GIEtr2-VpZk68fdlIOft6eYAmMEW0c95U7dn6Slz0LRJrx7qPGzpM5WTG1ujU6Vd8-wpN4KnzkelDAwyl1s_UsPytjcpCmqB5XlmzJTBgeOjB4eCHBWS7dJ4gRtWl_OSWyiyKrblm6yMJR3ZPQoa36PsP16_c3sFT41BY-eNa-h0o6avCn9QiGFaTP4E0zgL0g0LFxD6QT-glBNOOotW9dy8YqOlEFfVKIPdDLxuM-4ntVUBwnkIGfpx7KyqE5qN2pkQ54TNgqJB_nP7Zd9CyU9eEnCvQzSzaDs7RbePIgy3ZP3CTSNdpPi_zkhFyw";
  const ordersTableBody = document.getElementById("orders_table_body");

  try {
    const response = await fetch(`${BASE_URL}/Ventas/cliente/${clienteId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const ventas = await response.json();
      ordersTableBody.innerHTML = "";

      if (ventas.length > 0) {
        ventas.forEach((venta) => {
          const row = document.createElement("tr");

          //ID del pedido
          const idCell = document.createElement("td");
          idCell.textContent = `#${venta.id}`;
          row.appendChild(idCell);

          //Total
          const totalCell = document.createElement("td");
          totalCell.textContent = `${venta.total.toFixed(2)}$`;
          row.appendChild(totalCell);

          //Estado
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
        noOrdersCell.textContent =
          "Parece que no comprado nada aun, ¡Que espera compre ya!";
        noOrdersCell.classList.add("text-center");
        noOrdersRow.appendChild(noOrdersCell);
        ordersTableBody.appendChild(noOrdersRow);
      }
    } else {
      console.error(
        "Error al obtener los datos del cliente:",
        response.statusText
      );
    }
  } catch (error) {
    console.error("Hubo un problema con la solicitud:", error);
  }
});
