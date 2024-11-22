import { eventManager, BASE_URL } from "./utils.js";

document
  .getElementById("loginRST")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("user").value;
    const nombre = document.getElementById("name").value;
    const apellido = document.getElementById("lastname").value;
    const correo = document.getElementById("email").value;
    const celular = document.getElementById("phone").value;
    const contra = document.getElementById("pass").value;

    eventManager(async () => {
      fetch(`${BASE_URL}/Clientes/usuario`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: nombre,
          apellido: apellido,
          username: username,
          telefono: celular,
          correo: correo,
          password: contra,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            console.log(data);
          } else {
            alert("Registro fallido");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Hubo un problema con el registro, inténtelo de nuevo");
        });
    })();
  });

document
  .getElementById("loginBtn")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    eventManager(async () => {
      fetch(`${BASE_URL}/Usuarios/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: username,
          password: password,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.token) {
            console.log(data.token);
            // window.location.href = "/dashboard";
          } else {
            alert("Credenciales incorrectas");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Hubo un problema con el inicio de sesión");
        });
    })();
  });
