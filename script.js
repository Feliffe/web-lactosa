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


function copiarCorreo(event) {
    event.preventDefault(); 
    const correo = "contactolactosaintolerante@gmail.com";
    
    // Método de respaldo seguro para local y web
    const tempInput = document.createElement("input");
    tempInput.value = correo;
    document.body.appendChild(tempInput);
    tempInput.select();
    tempInput.setSelectionRange(0, 99999); 
    
    try {
        document.execCommand("copy");
        mostrarNotificacion();
    } catch (err) {
        console.error("Error al copiar el correo: ", err);
    }
    
    
    document.body.removeChild(tempInput);
}

function mostrarNotificacion() {
    const toast = document.getElementById('toast-notificacion');
    
    toast.classList.add('mostrar');
    
    setTimeout(() => {
        toast.classList.remove('mostrar');
    }, 3000);
}
