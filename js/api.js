// Se encarga ÚNICAMENTE de la comunicación con el servidor.

const URL_COMENTARIOS = '/api/comentarios'; // ruta relativa: portable

// Envía un comentario al servidor (POST). Devuelve la respuesta del servidor.
export async function enviarComentario(datos) {
    const respuesta = await fetch(URL_COMENTARIOS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    });

    // Si el servidor responde con error, lo propagamos para que main lo maneje
    if (!respuesta.ok) {
        const datosError = await respuesta.json().catch(() => ({}));
        throw new Error(datosError.error || 'No se pudo guardar el comentario.');
    }

    return respuesta.json();
}

// Obtiene la lista de comentarios guardados (GET). Devuelve un arreglo.
export async function obtenerComentarios() {
    const respuesta = await fetch(URL_COMENTARIOS);

    if (!respuesta.ok) {
        throw new Error('No se pudieron obtener los comentarios.');
    }

    return respuesta.json();
}