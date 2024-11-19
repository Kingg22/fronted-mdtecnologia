// Javascript para Detalle producto
document.addEventListener("DOMContentLoaded", () => {
    const carousel = document.querySelector("#carousel .carousel-inner");
    const items = document.querySelectorAll(".carousel-item");
    const prevButton = document.getElementById("prev");
    const nextButton = document.getElementById("next");
    let currentIndex = 0;

    const updateCarousel = () => {
        items.forEach((item, index) => {
            item.classList.remove("active");
            if (index === currentIndex) {
                item.classList.add("active");
            }
        });
    };

    prevButton.addEventListener("click", () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : items.length - 1;
        updateCarousel();
    });

    nextButton.addEventListener("click", () => {
        currentIndex = (currentIndex < items.length - 1) ? currentIndex + 1 : 0;
        updateCarousel();
    });
});

(function () {
    "use strict";

    // Product Quantity
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
})();
