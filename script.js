const integrantes = {
    juanfra: {
        descripcion: 'about/desjuanfra.txt',
        fotos: ['juanfra1.jpg', 'juanfra2.png', 'juanfra3.jpg']
    },
    vice: {
        descripcion: 'about/descastro.txt',
        fotos: ['vicente1.jpg', 'vicente2.png', 'vicente3.jpg']
    },
    iffe: {
        descripcion: 'about/desiffe.txt',
        fotos: ['iffe1.jpg', 'iffe2.png', 'iffe3.JPG']
    },
    sandman: {
        descripcion: 'about/desbenja.txt',
        fotos: ['benja1.png', 'benja2.png', 'benja3.jpg']
    },
    coni: {
        descripcion: 'about/desconi.txt',
        fotos: ['coni1.jpg', 'coni2.jpg', 'coni3.jpg']
    }
};

const seccionInfo = document.getElementById('seccionInfo');
const botonAcerca = document.querySelector('.btn-desplegable');
const botonesIntegrantes = document.querySelectorAll('.integrante');
const descripcion = document.getElementById('descripcionTexto');
const descripcionBanda = descripcion.innerHTML;
const fondoIntegrante = document.getElementById('memberBackground');
const vistaMovil = window.matchMedia('(max-width: 768px)');
const movimientoReducido = window.matchMedia('(prefers-reduced-motion: reduce)');
const bgCover = document.getElementById('bgCover');
let temporizadorFotos;
let temporizadorDesvanecimiento;
let alTerminarDesvanecimiento;
let solicitudDescripcion = 0;

function desplegarInfo() {
    const abierto = seccionInfo.classList.toggle('abierto');
    const body = document.body;

    botonAcerca.setAttribute('aria-expanded', String(abierto));
    body.classList.toggle('fondo-activo', abierto);
    botonesIntegrantes.forEach((boton) => {
        boton.disabled = !abierto;
    });

    if (abierto) {
        limpiarFotosIntegrante();
        botonesIntegrantes.forEach((boton) => {
            boton.setAttribute('aria-pressed', 'false');
        });
        descripcion.style.minHeight = '';
        descripcion.removeAttribute('aria-busy');
        descripcion.innerHTML = descripcionBanda;
    } else {
        solicitudDescripcion += 1;
        desvanecerFotosIntegrante();
        botonesIntegrantes.forEach((boton) => {
            boton.setAttribute('aria-pressed', 'false');
        });
        descripcion.style.minHeight = '';
        descripcion.removeAttribute('aria-busy');
    }
}

function reservarAlturaDescripcion() {
    const alturaActual = Math.max(
        descripcion.offsetHeight,
        descripcion.scrollHeight,
        Number.parseFloat(descripcion.style.minHeight) || 0
    );
    descripcion.style.minHeight = `${alturaActual}px`;
}

function mostrarDescripcionBanda() {
    if (!seccionInfo.classList.contains('abierto')) {
        return;
    }

    solicitudDescripcion += 1;
    limpiarFotosIntegrante();
    botonesIntegrantes.forEach((boton) => {
        boton.setAttribute('aria-pressed', 'false');
    });
    reservarAlturaDescripcion();
    descripcion.removeAttribute('aria-busy');
    descripcion.innerHTML = descripcionBanda;
}

async function seleccionarIntegrante(boton) {
    const perfil = integrantes[boton.dataset.integrante];

    if (!perfil || !seccionInfo.classList.contains('abierto')) {
        return;
    }

    if (boton.getAttribute('aria-pressed') === 'true') {
        mostrarDescripcionBanda();
        return;
    }

    const solicitud = ++solicitudDescripcion;
    reservarAlturaDescripcion();
    botonesIntegrantes.forEach((integrante) => {
        integrante.setAttribute('aria-pressed', String(integrante === boton));
    });
    document.body.classList.add('integrante-activo');
    descripcion.setAttribute('aria-busy', 'true');
    mostrarFotosIntegrante(perfil.fotos);

    try {
        const respuesta = await fetch(perfil.descripcion);
        if (!respuesta.ok) {
            throw new Error(`No se pudo cargar ${perfil.descripcion}: ${respuesta.status}`);
        }

        const texto = await respuesta.text();
        if (solicitud === solicitudDescripcion) {
            reservarAlturaDescripcion();
            descripcion.textContent = texto.trim();
        }
    } catch (error) {
        if (solicitud === solicitudDescripcion) {
            descripcion.textContent = 'No se pudo cargar la descripción. Inténtalo de nuevo.';
            console.error(error);
        }
    } finally {
        if (solicitud === solicitudDescripcion) {
            descripcion.removeAttribute('aria-busy');
        }
    }
}

function mostrarFotosIntegrante(fotos) {
    limpiarFotosIntegrante();
    document.body.classList.add('integrante-activo');

    const imagenes = fotos.map((archivo, indice) => {
        const imagen = document.createElement('img');
        imagen.className = 'member-photo';
        imagen.src = `about/fotos/web/${archivo.replace(/\.[^.]+$/, '.jpg')}`;
        imagen.alt = '';
        imagen.setAttribute('aria-hidden', 'true');
        if (indice === 0) {
            imagen.classList.add('visible');
        }
        fondoIntegrante.appendChild(imagen);
        return imagen;
    });

    if (vistaMovil.matches && !movimientoReducido.matches && imagenes.length > 1) {
        let fotoActual = 0;
        temporizadorFotos = window.setInterval(() => {
            imagenes[fotoActual].classList.remove('visible');
            fotoActual = (fotoActual + 1) % imagenes.length;
            imagenes[fotoActual].classList.add('visible');
        }, 4500);
    }
}

function limpiarFotosIntegrante() {
    cancelarDesvanecimientoFotos();
    window.clearInterval(temporizadorFotos);
    fondoIntegrante.replaceChildren();
    document.body.classList.remove('integrante-activo');
}

function cancelarDesvanecimientoFotos() {
    window.clearTimeout(temporizadorDesvanecimiento);
    if (alTerminarDesvanecimiento) {
        bgCover.removeEventListener('transitionend', alTerminarDesvanecimiento);
        alTerminarDesvanecimiento = null;
    }
    document.body.classList.remove('integrante-cerrando');
}

function desvanecerFotosIntegrante() {
    window.clearInterval(temporizadorFotos);
    if (!fondoIntegrante.childElementCount) {
        limpiarFotosIntegrante();
        return;
    }

    document.body.classList.add('integrante-cerrando');
    document.body.classList.remove('integrante-activo');

    const finalizar = (event) => {
        if (event && (event.target !== bgCover || event.propertyName !== 'opacity')) {
            return;
        }

        cancelarDesvanecimientoFotos();
        fondoIntegrante.replaceChildren();
    };

    alTerminarDesvanecimiento = finalizar;
    bgCover.addEventListener('transitionend', finalizar);
    temporizadorDesvanecimiento = window.setTimeout(finalizar, 900);
}

botonesIntegrantes.forEach((boton) => {
    boton.addEventListener('click', () => seleccionarIntegrante(boton));
});

function actualizarPresentacionFotos() {
    const botonSeleccionado = document.querySelector('.integrante[aria-pressed="true"]');
    if (botonSeleccionado) {
        mostrarFotosIntegrante(integrantes[botonSeleccionado.dataset.integrante].fotos);
    }
}

vistaMovil.addEventListener('change', actualizarPresentacionFotos);
movimientoReducido.addEventListener('change', actualizarPresentacionFotos);

function toggleFechas() {
    const boton = document.querySelector('.fechas-toggle');
    const panel = document.getElementById('fechasPanel');
    const abierto = boton.getAttribute('aria-expanded') === 'true';

    boton.setAttribute('aria-expanded', String(!abierto));
    panel.setAttribute('aria-hidden', String(abierto));
    panel.classList.toggle('abierto', !abierto);
}
