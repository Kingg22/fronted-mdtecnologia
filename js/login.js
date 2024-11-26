import { eventManager, BASE_URL, alertRedireccion, alert } from "./utils.js";
import { loadBreadcrumb } from "./main.js";
// TODO cambiar por feedback y validaciones de form
document.addEventListener("DOMContentLoaded", async function () {
    loadBreadcrumb([
        { name: "Home", href: "/Home.html" },
        { name: "Perfil", href: "/Perfil.html" },
        { name: "Login", href: null },
    ]);
    const token = window.sessionStorage.getItem("token");
    if (token)
        alertRedireccion("/Perfil.html", "Sesión iniciada");
    document
        .getElementById("loginRST")
        .addEventListener("submit", function (event) {
        event.preventDefault();
        const username = document.getElementById("user");
        const nombre = document.getElementById("name");
        const apellido = document.getElementById("lastname");
        const correo = document.getElementById("email");
        const celular = document.getElementById("phone");
        const contra = document.getElementById("pass");
        eventManager(async () => {
            fetch(`${BASE_URL}/Clientes/usuario`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    accept: "application/json",
                },
                body: JSON.stringify({
                    nombre: nombre.value,
                    apellido: apellido.value,
                    username: username.value,
                    telefono: celular.value,
                    correo: correo.value,
                    password: contra.value,
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                scrollTo({ top: 0, behavior: "smooth" });
                if (data?.cliente) {
                    alert("Registro exitoso", "success");
                }
                else {
                    alert("Registro fallido", "danger");
                }
                nombre.value = "";
                apellido.value = "";
                username.value = "";
                celular.value = "";
                correo.value = "";
                contra.value = "";
            })
                .catch((error) => {
                console.error("Error:", error);
                alert("Hubo un problema con el registro, inténtelo de nuevo", "dark");
            });
        })();
    });
    document
        .getElementById("loginBtn")
        .addEventListener("submit", function (event) {
        event.preventDefault();
        const username = document.getElementById("username");
        const password = document.getElementById("password");
        eventManager(async () => {
            fetch(`${BASE_URL}/Usuarios/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    accept: "application/json",
                },
                body: JSON.stringify({
                    email: username.value,
                    password: password.value,
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                if (data?.token) {
                    sessionStorage.setItem("token", data.token);
                    sessionStorage.setItem("id_cliente", data.cliente?.id);
                    sessionStorage.setItem("cliente", JSON.stringify(data.cliente));
                    window.location.href = "/Perfil.html";
                }
                else {
                    alert("Credenciales incorrectas", "secondary");
                }
                username.value = "";
                password.value = "";
            })
                .catch((error) => {
                console.error("Error:", error);
                alert("Hubo un problema con el inicio de sesión", "dark");
            });
        })();
    });
});
