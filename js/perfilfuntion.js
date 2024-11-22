import { BASE_URL, eventManager } from "./utils.js";

document.addEventListener("DOMContentLoaded", async function () {
  const clienteId = "";

  try {
    const response = await fetch(`${BASE_URL}/Clientes/${clienteId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const userData = await response.json();
      const cliente = userData.cliente;

      const fullName = `${cliente.nombre || ""} ${cliente.apellido || ""}`.trim() || "Nombre no disponible";
      document.getElementById("user_name").textContent = fullName;

      document.getElementById("user_email").textContent = cliente.correo || "Correo no disponible";

      document.getElementById("user_phone").textContent = cliente.telefono || "Teléfono no disponible";

      const addresses = cliente.direcciones || [];
      const addressList = document.getElementById("user_addresses");

      addressList.innerHTML = "";

      if (addresses.length > 0) {
        addresses.slice(0, 3).forEach((direccion) => {
          const li = document.createElement("li");
          li.textContent = direccion || "Dirección no disponible";
          addressList.appendChild(li);
        });
      } else {
        const li = document.createElement("li");
        li.textContent = "Dirección no disponible";
        addressList.appendChild(li);
      }
    } else {
      console.error("Error al obtener los datos del cliente:", response.statusText);
    }
  } catch (error) {
    console.error("Hubo un problema con la solicitud:", error);
  }
});
