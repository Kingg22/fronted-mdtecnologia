import { BASE_URL, eventManager } from "./utils.js";

document.addEventListener("DOMContentLoaded", async function () {
  const id_cliente = "40e722a8-7261-4858-8f4f-4b9d1e53062c";
  const token =
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxOGQxZmY1Yi1lNjM5LTRkZjctOWJiZC1jZmQ1ZmJiNTEyZmYiLCJyb2xlIjoiY2xpZW50ZSIsIm5iZiI6MTczMjMxNDk3NywiZXhwIjoxNzMyMzE4NTc3LCJpYXQiOjE3MzIzMTQ5NzcsImlzcyI6Ik1EVEVDSCJ9.YedfWXknnTbtl7EudkYYl0kmAIVb0lLfwFwKV3SHV7sdwVCKoYaOqXCh7E3oVonjqrgVN6n4j93dEa18lKfYeoLa_pdb-WFumhg2YLTNaUxjNA-Urtefux2CSzk4tVb97-0eZEBOXY9jCps77pDV3rYEupsx7F2RzvuQ_j6kkWbKeVEEfxcihvrY13tlU4GBpdPEE44bW8wqOYicdDRj-BUXCMPg6dMCxhlBpBeUIYoMXmDzb7bpcdHclnAgZJ50qMHS0UtcS5uqMmUQ5THKtocDbB5diM0YbIZ74CuT8rV6OqbHBLALAxcOuIa78YmBlFRQEV6OiVCp_97PuuMszw";

  try {
    const response = await fetch(`${BASE_URL}/Clientes/${id_cliente}}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const userData = await response.json();
      const cliente = userData.cliente;

      const fullName =
        `${cliente.nombre || ""} ${cliente.apellido || ""}`.trim() ||
        "Nombre Confidencial";
      document.getElementById("user_name").textContent = fullName;

      document.getElementById("user_email").textContent =
        cliente.correo || "Correo no Asignado";

      document.getElementById("user_phone").textContent =
        cliente.telefono || "Teléfono no Asignado";

      const addresses = cliente.direcciones || [];
      const addressList = document.getElementById("user_addresses");

      addressList.innerHTML = "";

      if (addresses.length > 0) {
        addresses.slice(0, 3).forEach((direccion) => {
          const li = document.createElement("li");
          li.textContent = direccion || "Dirección Registrada";
          addressList.appendChild(li);
        });
      } else {
        const li = document.createElement("li");
        li.textContent = "Dirección Registrada";
        addressList.appendChild(li);
      }
    } else {
      console.error("Error al obtener los datos del cliente:", response);
    }
  } catch (error) {
    console.error("Hubo un problema con la solicitud:", error);
  }
});
