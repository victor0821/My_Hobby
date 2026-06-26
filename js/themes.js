
// Módulo de modo oscuro con persistencia en localStorage.
// Se inicializa desde main.js (import / export).

const CLAVE = 'tema';                  // clave en localStorage
const raiz  = document.documentElement; // el elemento <html>

// Aplica el tema guardado (claro u oscuro)
function aplicarTemaGuardado() {
    if (localStorage.getItem(CLAVE) === 'oscuro') {
        raiz.setAttribute('data-theme', 'oscuro');
    } else {
        raiz.removeAttribute('data-theme');
    }
}

// Actualiza el texto y los atributos de accesibilidad del botón
function sincronizarBoton(boton) {
    const esOscuro = raiz.getAttribute('data-theme') === 'oscuro';
    boton.textContent = esOscuro ? 'Modo Claro' : 'Modo Dark';
    boton.setAttribute('aria-label', esOscuro ? 'Activar modo claro' : 'Activar modo oscuro');
    boton.setAttribute('aria-pressed', String(esOscuro));
}

// Alterna entre claro y oscuro y guarda la preferencia
function alternarTema() {
    const esOscuro = raiz.getAttribute('data-theme') === 'oscuro';
    if (esOscuro) {
        raiz.removeAttribute('data-theme');
        localStorage.setItem(CLAVE, 'claro');
    } else {
        raiz.setAttribute('data-theme', 'oscuro');
        localStorage.setItem(CLAVE, 'oscuro');
    }
}

// Punto de entrada: lo llama main.js
export function inicializarTema() {
    // 1) Recuperamos y aplicamos el tema guardado
    aplicarTemaGuardado();

    // 2) Conectamos el botón
    const boton = document.getElementById('btn-dark-mode');
    if (!boton) return;

    sincronizarBoton(boton);

    boton.addEventListener('click', () => {
        alternarTema();
        sincronizarBoton(boton);
    });
}