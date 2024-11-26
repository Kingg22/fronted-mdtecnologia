import { BASE_URL } from "./utils.js";
import { loadBreadcrumb } from "./main.js";
document.addEventListener("DOMContentLoaded", async function () {
    loadBreadcrumb([
        { name: "Home", href: "/Home.html" },
        { name: "Perfil", href: null },
    ]);
    const ordersTableBody = document.getElementById("orders_table_body");
    const id_cliente = sessionStorage.getItem("id_cliente");
    const token = sessionStorage.getItem("token");
    if (!token)
        location.replace("/Login.html");
    document.getElementById("logout_button").addEventListener("click", () => {
        localStorage.clear();
        sessionStorage.clear();
        location.replace("/Login.html");
    });
    fetch(`${BASE_URL}/Clientes/${id_cliente}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            accept: "application/json",
        },
    })
        .then((response) => response.json())
        .then((data) => {
        const cliente = data.cliente;
        sessionStorage.setItem("cliente", JSON.stringify(cliente));
        document.getElementById("user_name").textContent =
            `${cliente.nombre || ""} ${cliente.apellido || ""}`.trim() ||
                "Nombre Confidencial";
        document.getElementById("user_email").textContent =
            "Correo: " + cliente.correo;
        document.getElementById("user_phone").textContent =
            cliente.telefono || "Teléfono: No registrado";
        const addresses = cliente.direcciones || [];
        const addressList = document.getElementById("user_addresses");
        addressList.innerHTML = "";
        const li = document.createElement("li");
        if (addresses.length > 0) {
            addresses
                .slice(0, 3)
                .forEach((direccion) => {
                li.textContent =
                    direccion.descripcion + ", " + direccion.provincia ||
                        "Dirección Registrada";
            });
        }
        else {
            li.textContent = "Direcciones No Registrada";
        }
        addressList.appendChild(li);
    })
        .catch((error) => console.error("Error en direcciones: ", error));
    fetch(`${BASE_URL}/Ventas/cliente/${id_cliente}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            accept: "application/json",
        },
    })
        .then((response) => response.json())
        .then((data) => {
        ordersTableBody.innerHTML = "";
        if (data.ventas?.length > 0) {
            data.ventas.forEach((venta) => {
                const row = document.createElement("tr");
                // id del pedido
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
                        console.warn("No se ha podido pintar el estado del producto correctamente");
                        break;
                }
                statusCell.appendChild(statusBadge);
                row.appendChild(statusCell);
                ordersTableBody.appendChild(row);
            });
        }
        else {
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
    })
        .catch((error) => console.error("Error pedidos cliente: ", error));
});
