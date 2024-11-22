// Carrusel del home
document.addEventListener('DOMContentLoaded', function () {
    const slides = document.querySelectorAll('#header-carousel .carousel-item');
    let slideIndex = 0;

    const showSlide = function (index) {
        slides.forEach((slide, i) => {
            slide.style.display = i === index ? 'block' : 'none';
            slide.classList.toggle('active', i === index);
        });
    };

    const nextSlide = function () {
        slideIndex = (slideIndex + 1) % slides.length;
        showSlide(slideIndex);
    };
    setInterval(nextSlide, 3000);
    showSlide(slideIndex);
});

