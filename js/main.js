
// main.js
// Orquestador: coordina los módulos del sistema.
//   · themes.js → modo oscuro
//   · ui.js     → validación y mensajes
//   · api.js    → comunicación con el servidor

import { inicializarTema } from './themes.js';
import { enviarComentario, obtenerComentarios } from './api.js';
import { validarFormulario, mostrarEstado, mostrarComentarios } from './ui.js';
 
// 1) Tema (modo claro / oscuro)
inicializarTema();
 
// 2) Cargar y mostrar los comentarios guardados
async function cargarComentarios() {
    try {
        const comentarios = await obtenerComentarios();
        mostrarComentarios(comentarios);
    } catch (error) {
        console.error('No se pudieron cargar los comentarios:', error);
    }
}
 
cargarComentarios(); // al abrir la página
 
// 3) Formulario de comentarios
const formulario = document.getElementById('formulario-comentarios');
 
if (formulario) {
    formulario.addEventListener('submit', async (evento) => {
        evento.preventDefault(); // evita que la página se recargue
 
        // Validar (responsabilidad de ui.js)
        const resultado = validarFormulario(formulario);
        if (!resultado.valido) {
            mostrarEstado(resultado.error, 'error');
            return;
        }
 
        // Enviar al servidor (responsabilidad de api.js)
        try {
            await enviarComentario(resultado.datos);
            mostrarEstado('¡Tu comentario se guardó correctamente! 🙌', 'ok');
            formulario.reset();
            await cargarComentarios(); // refrescamos la lista con el nuevo comentario
        } catch (error) {
            console.error('Fallo la petición:', error);
            mostrarEstado(error.message, 'error');
        }
    });
}