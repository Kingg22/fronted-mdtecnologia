document.addEventListener('DOMContentLoaded', function () {
    const dropdownButton = document.querySelector('.btn[data-toggle="collapse"]');
    const dropdownMenu = document.querySelector('#navbar-vertical');

    // Alterna la clase "show" en el menú desplegable al hacer clic en el botón
    dropdownButton.addEventListener('click', function (event) {
        event.preventDefault(); // Evita el comportamiento predeterminado del enlace
        dropdownMenu.classList.toggle('show');
    });

    // Oculta el menú desplegable si se hace clic fuera de él
    document.addEventListener('click', function (event) {
        if (!dropdownButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.classList.remove('show');
        }
    });
});
