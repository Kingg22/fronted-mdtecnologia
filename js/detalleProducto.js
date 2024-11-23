// Javascript para Detalle producto
document.addEventListener("DOMContentLoaded", () => {
    // Carrusel de imágenes producto
    const items = document.querySelectorAll(".carousel-item");
    let currentIndex = 0;

    const updateCarousel = () => {
        items.forEach((item, index) => {
            item.classList.remove("active");
            if (index === currentIndex) {
                item.classList.add("active");
            }
        });
    };

    document.getElementById("prev").addEventListener("click", () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : items.length - 1;
        updateCarousel();
    });

    document.getElementById("next").addEventListener("click", () => {
        currentIndex = (currentIndex < items.length - 1) ? currentIndex + 1 : 0;
        updateCarousel();
    });

    // Productos Cantidad
    document.querySelectorAll('.quantity button').forEach(function (button) {
        button.addEventListener('click', function () {
            let input = button.closest('.quantity').querySelector('input');
            let oldValue = parseFloat(input.value);
            let newVal;

            if (button.classList.contains('btn-plus')) {
                newVal = oldValue + 1;
            } else {
                newVal = oldValue > 0 ? oldValue - 1 : 0;
            }

            input.value = newVal;
        });
    });
});
