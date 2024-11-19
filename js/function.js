(function () {
    "use strict";

    document.addEventListener('DOMContentLoaded', function () {
        let slideIndex = 0;
        const slides = document.querySelectorAll('#header-carousel .carousel-item');

        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.style.display = i === index ? 'block' : 'none';
                slide.classList.toggle('active', i === index);
            });
        }

        function nextSlide() {
            slideIndex = (slideIndex + 1) % slides.length;
            showSlide(slideIndex);
        }

        // Auto-play slides every 3 seconds
        setInterval(nextSlide, 3000);

        // Initialize the carousel
        showSlide(slideIndex);
    });

})();
