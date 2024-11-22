import { BASE_URL, eventManager } from "./utils.js";
document.addEventListener("DOMContentLoaded", async function () {

  
    try {
      const response = await fetch("${BASE_URL}/Clientes/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        const userData = await response.json();
  
        document.getElementById("user_name").textContent = userData.name || "Nombre no disponible";
        document.getElementById("user_email").textContent = userData.email || "Correo no disponible";
        document.getElementById("user-phone").textContent = userData.phone || "Telefono no disponible";
        document.getElementById("user_address").textContent =
          userData.address || "Dirección no disponible";
      } else {
        console.error("Error al obtener los datos del usuario:", response.statusText);
      }
    } catch (error) {
      console.error("Hubo un problema con la solicitud:", error);
    }
  });
  
