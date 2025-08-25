const faders = document.querySelectorAll('.move-in-out');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        } else {
            entry.target.classList.remove('visible'); // remove class when out of view
        }
    });
}, { threshold: 0.3 }); // element is considered visible when 20% is on screen

faders.forEach(el => observer.observe(el));
