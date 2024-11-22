document.addEventListener('DOMContentLoaded', async function () {
  // --- Menú Desplegable ---
  const dropdownButton = document.querySelector('.btn[data-toggle="collapse"]');
  const dropdownMenu = document.querySelector('#navbar-vertical');

  if (dropdownButton && dropdownMenu) {
    dropdownButton.addEventListener('click', function (event) {
      event.preventDefault();
      dropdownMenu.classList.toggle('show');
    });

    document.addEventListener('click', function (event) {
      if (!dropdownButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
        dropdownMenu.classList.remove('show');
      }
    });
  }
});
