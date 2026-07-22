function desplegarInfo() {
    const seccion = document.getElementById('seccionInfo');
    const body = document.body;

    seccion.classList.toggle('abierto');
    body.classList.toggle('fondo-activo');

    if (seccion.classList.contains('abierto')) {
        let start = null;

        function step(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;

            window.scrollBy(0, 8);

            if (progress < 900) {
                window.requestAnimationFrame(step);
            }
        }

        window.requestAnimationFrame(step);
    }
}

function toggleEntradas(event) {
    event.preventDefault();

    const entradasSection = document.getElementById('entradas');
    entradasSection.classList.toggle('abierto');

    if (entradasSection.classList.contains('abierto')) {
        entradasSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}
